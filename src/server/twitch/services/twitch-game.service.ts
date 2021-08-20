import {
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
import { UserService } from '../../user/services/user.service';
import { TwitchTokenService } from './twitch-token.service';

@Injectable()
export class TwitchGameService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    private userService: UserService,
    private twitchTokenService: TwitchTokenService,
  ) {}

  async getGame(channel: string, gameName: string): Promise<any> {
    const user = await this.userService.findByLogin(channel);
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .get(`${this.configService.twitch.apiUri}games?name=${gameName}`, {
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
      return await this.getGame(channel, gameName);
    }

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Invalid Twitch Token`);
    }

    return data.data;
  }

  async getGameId(channel: string, gameName: string): Promise<string> {
    const games = await this.getGame(channel, gameName);
    if (games.length > 0) {
      return games[0].id;
    }
    return '';
  }
}
