import { Injectable } from '@nestjs/common';
import { TwitchRewardService } from '../../twitch/services/twitch-reward.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class RewardService {
  constructor(private twitchRewardService: TwitchRewardService) {}

  async findByUser(user: UserEntity) {
    const rewards = await this.twitchRewardService.getRewards(user);
    return rewards;
  }
}
