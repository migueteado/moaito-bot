import {
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
import { UserEntity } from '../../user/entities/user.entity';
import {
  CreateTwitchRewardDTO,
  UpdateTwitchRewardDTO,
} from '../dtos/twitch-reward.dto';
import { TwitchTokenService } from './twitch-token.service';

@Injectable()
export class TwitchRewardService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    private twitchTokenService: TwitchTokenService,
  ) {}

  async getRewards(user: UserEntity) {
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .get(
        `${this.configService.twitch.apiUri}channel_points/custom_rewards?broadcaster_id=${user.id}`,
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
      return this.getRewards(user);
    }

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Unable to Get Custom Rewards`);
    }

    return data.data;
  }

  async createReward(user: UserEntity, reward: CreateTwitchRewardDTO) {
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .post(
        `${this.configService.twitch.apiUri}channel_points/custom_rewards?broadcaster_id=${user.id}`,
        reward,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Client-Id': this.configService.twitch.clientId,
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    const { data, status } = response;

    if (status === 401) {
      await this.twitchTokenService.refreshTwitchTokenFromUser(user);
      return this.createReward(user, reward);
    }

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Unable to Create Custom Reward`);
    }

    return data.data;
  }

  async updateReward(
    user: UserEntity,
    rewardId: string,
    reward: UpdateTwitchRewardDTO,
  ) {
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .patch(
        `${this.configService.twitch.apiUri}channel_points/custom_rewards?broadcaster_id=${user.id}&id=${rewardId}`,
        reward,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Client-Id': this.configService.twitch.clientId,
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise()
      .then((res) => res)
      .catch((error) => error.response);

    console.log(response);

    const { data, status } = response;

    if (status === 401) {
      await this.twitchTokenService.refreshTwitchTokenFromUser(user);
      return this.updateReward(user, rewardId, reward);
    }

    if (!data || status !== 201) {
      throw new UnauthorizedException(`Unable to Update Custom Reward`);
    }

    return data.data;
  }

  async deleteReward(user: UserEntity, rewardId: string) {
    const token = await this.twitchTokenService.find(user);

    const response = await this.httpService
      .delete(
        `${this.configService.twitch.apiUri}channel_points/custom_rewards?broadcaster_id=${user.id}&id=${rewardId}`,
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
      return this.deleteReward(user, rewardId);
    }

    if (status !== 204) {
      throw new UnauthorizedException(`Unable to Delete Custom Reward`);
    }

    return data.data;
  }
}
