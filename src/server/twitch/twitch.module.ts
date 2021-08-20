import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TwitchTokenEntity } from './entities/twitch-token.entity';
import { TwitchChannelService } from './services/twitch-channel.service';
import { TwitchTokenService } from './services/twitch-token.service';
import { TwitchUserService } from './services/twitch-user.service';
import { TwitchGameService } from './services/twitch-game.service';
import { TwitchRewardService } from './services/twitch-reward.service';
import { TwitchRewardController } from './controllers/twitch-reward.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TwitchTokenEntity]),
    HttpModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    TwitchChannelService,
    TwitchUserService,
    TwitchTokenService,
    TwitchGameService,
    TwitchRewardService,
  ],
  exports: [
    TwitchUserService,
    TwitchTokenService,
    TwitchChannelService,
    TwitchGameService,
    TwitchRewardService,
  ],
  controllers: [TwitchRewardController],
})
export class TwitchModule {}
