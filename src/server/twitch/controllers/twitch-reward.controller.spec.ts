import { Test, TestingModule } from '@nestjs/testing';
import { TwitchRewardController } from './twitch-reward.controller';

describe('TwitchRewardController', () => {
  let controller: TwitchRewardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchRewardController],
    }).compile();

    controller = module.get<TwitchRewardController>(TwitchRewardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
