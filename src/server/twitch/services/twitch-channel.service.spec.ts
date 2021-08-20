import { Test, TestingModule } from '@nestjs/testing';
import { TwitchChannelService } from './twitch-channel.service';

describe('TwitchChannelService', () => {
  let service: TwitchChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchChannelService],
    }).compile();

    service = module.get<TwitchChannelService>(TwitchChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
