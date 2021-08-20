import {
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
import { TwitchTokenService } from '../../twitch/services/twitch-token.service';
import { UserService } from '../../user/services/user.service';
import { ChannelInfo } from '../../chatbot/definitions/channel-info';

@Injectable()
export class TwitchChannelService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    private userService: UserService,
    private twitchTokenService: TwitchTokenService,
  ) {}

  async getChannelInformation(
    channel: string,
    info: ChannelInfo,
  ): Promise<string> {
    const user = await this.userService.findByLogin(channel);
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .get(
        `${this.configService.twitch.apiUri}channels?broadcaster_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Client-Id': this.configService.twitch.clientId,
          },
        },
      )
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    const { data, status } = response;

    if (status === 401) {
      await this.twitchTokenService.refreshTwitchTokenFromUser(user);
      return this.getChannelInformation(channel, info);
    }

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Invalid Twitch Token`);
    }

    switch (info) {
      case ChannelInfo.title:
        return data.data[0].title;
      case ChannelInfo.game:
        return data.data[0].game_name;
      case ChannelInfo.delay:
        return data.data[0].delay;
      case ChannelInfo.language:
        return data.data[0].broadcaster_language;
    }
  }

  async updateChannelInformation(
    channel: string,
    title?: string,
    game?: string,
    delay?: number,
    language?: string,
  ): Promise<Boolean> {
    const user = await this.userService.findByLogin(channel);
    const token = await this.twitchTokenService.find(user);

    let rawData = {};
    if (!!title) rawData['title'] = title;
    if (!!game) rawData['game_id'] = game;
    if (!!delay) rawData['delay'] = delay;
    if (!!language) rawData['broadcaster_language'] = language;
    console.log(rawData);
    const response = await this.httpService
      .patch(
        `${this.configService.twitch.apiUri}channels?broadcaster_id=${user.id}`,
        rawData,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Client-Id': this.configService.twitch.clientId,
          },
        },
      )
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    console.log(response);

    const { status } = response;

    if (status === 401) {
      await this.twitchTokenService.refreshTwitchTokenFromUser(user);
      return this.updateChannelInformation(channel, title);
    }

    if (status === 400) {
      return false;
    }

    if (status !== 204) {
      throw new UnauthorizedException(`Invalid Twitch Token`);
    }

    return true;
  }
}
