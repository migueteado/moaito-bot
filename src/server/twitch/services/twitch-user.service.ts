import {
  forwardRef,
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TwitchToken } from '../../common/objects/twitchToken';
import { User } from '../../common/objects/user';
import config from '../../config';
import { UserEntity } from '../../user/entities/user.entity';
import { TwitchTokenService } from './twitch-token.service';

@Injectable()
export class TwitchUserService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    @Inject(forwardRef(() => TwitchTokenService))
    private twitchTokenService: TwitchTokenService,
  ) {}

  async getUserFromTwitch(twitchToken: TwitchToken): Promise<User> {
    const response = await this.httpService
      .get(`${this.configService.twitch.apiUri}users`, {
        headers: {
          Authorization: `Bearer ${twitchToken.access_token}`,
          'Client-Id': this.configService.twitch.clientId,
        },
      })
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    const { data, status } = response;

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Invalid Twitch Token`);
    }

    const user: User = data.data[0] as User;
    return user;
  }

  async getProfileFromTwitch(user: UserEntity) {
    const token = await this.twitchTokenService.find(user);
    const response = await this.httpService
      .get(`${this.configService.twitch.apiUri}users`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Client-Id': this.configService.twitch.clientId,
        },
      })
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    const { data, status } = response;

    if (status === 401) {
      await this.twitchTokenService.refreshTwitchTokenFromUser(user);
      return this.getProfileFromTwitch(user);
    }

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Invalid Twitch Token`);
    }

    const twitchUser: User = data.data[0] as User;
    return twitchUser;
  }
}
