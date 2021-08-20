import { Test, TestingModule } from '@nestjs/testing';
import { TwitchRewardService } from './twitch-reward.service';

describe('TwitchRewardService', () => {
  let service: TwitchRewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchRewardService],
    }).compile();

    service = module.get<TwitchRewardService>(TwitchRewardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
