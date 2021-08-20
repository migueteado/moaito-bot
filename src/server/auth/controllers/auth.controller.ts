import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SimpleConsoleLogger } from 'typeorm';
import { TwitchTokenService } from '../../twitch/services/twitch-token.service';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twitchTokenService: TwitchTokenService,
  ) {}

  @Get('twitch')
  login(@Res() response: Response) {
    const { state, uri } = this.authService.getLoginUri();
    response.cookie('auth_state', state, { httpOnly: true, secure: true });
    response.redirect(uri);
  }

  @Get('signout')
  logout(@Res() response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.redirect('/');
  }

  @Get('twitch/callback')
  async twitchCallback(
    @Req() request: Request,
    @Res() response: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const { auth_state } = request.cookies;

      if (state === null || state !== auth_state) {
        throw new UnauthorizedException(`Auth state doesn't match`);
      }

      response.clearCookie('auth_state');

      const user: UserEntity = await this.twitchTokenService.getTwitchToken(
        code,
      );
      const tokens = await this.authService.generateJwt(user);

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
      });
      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
      });

      response.redirect('/');
    } catch (error) {
      console.log(error);
      response.redirect('/api/auth/twitch');
    }
  }

  @Post('refresh')
  async refreshAuthToken(
    @Req() request: Request,
    @Res() response: Response,
    @Body() data,
  ) {
    try {
      const refresh_token = data.refreshToken;
      const tokens = await this.authService.refreshJwt(refresh_token);

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
      });
      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
      });

      response.status(200).send({
        message: 'Auth refreshed',
        status: 200,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } catch (error) {
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      response.status(401).send({
        message: 'Invalid or Expired Token',
        status: 401,
      });
    }
  }
}
