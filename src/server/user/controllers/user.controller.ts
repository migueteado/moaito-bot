import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { AuthService } from '../../auth/services/auth.service';
import { TwitchToken } from '../../common/objects/twitchToken';
import { TwitchTokenService } from '../../twitch/services/twitch-token.service';
import { TwitchUserService } from '../../twitch/services/twitch-user.service';
import { UserService } from '../services/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private twitchUserService: TwitchUserService,
    private twitchTokenService: TwitchTokenService,
  ) {}

  @Get()
  find(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    return this.userService.find(userId);
  }

  @Get('profile')
  async findProfile(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.twitchUserService.getProfileFromTwitch(user);
  }
}
