import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObsSourceEntity } from './entities/obs-source.entity';
import { RewardEntity } from './entities/reward.entity';
import { RewardsGateway } from './gateways/rewards.gateway';
import { RewardController } from './controllers/reward.controller';
import { TwitchModule } from '../twitch/twitch.module';
import { RewardService } from './services/reward.service';
import { UserModule } from '../user/user.module';
import { SourceService } from './services/source.service';
import { SourceController } from './controllers/source.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardEntity, ObsSourceEntity]),
    TwitchModule,
    UserModule,
  ],
  providers: [RewardsGateway, RewardService, SourceService],
  controllers: [RewardController, SourceController],
})
export class RewardModule {}
