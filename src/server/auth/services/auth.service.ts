import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as qs from 'querystring';

import { tokenGenerator } from '../../common/utils/token-generator';
import config from '../../config';
import { UserEntity } from '../../user/entities/user.entity';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  twitchScopes: Array<string> = [
    'user_read',
    'channel:manage:broadcast',
    'channel:manage:redemptions',
    'channel:read:redemptions',
  ];

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async generateJwt(user: UserEntity) {
    const payload: JwtPayload = {
      userType: user.userType,
      sub: user.id,
    };

    await this.tokenService.delete(user);
    const refreshToken = (await this.tokenService.create(user)).token;

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user,
    };
  }

  async refreshJwt(refreshToken: string) {
    const token = await this.tokenService.findOne(refreshToken);
    return this.generateJwt(token.user);
  }

  getLoginUri() {
    const state = tokenGenerator(20);

    const queryString = qs.stringify({
      response_type: 'code',
      client_id: this.configService.twitch.clientId,
      redirect_uri: this.configService.twitch.redirectUri,
      scope: this.twitchScopes.join(' '),
      state: state,
      force_verify: true,
    });

    return {
      state: state,
      uri: `${this.configService.twitch.authUri}?${queryString}`,
    };
  }
}
