import { Test, TestingModule } from '@nestjs/testing';
import { TwitchGameService } from './twitch-game.service';

describe('TwitchGameService', () => {
  let service: TwitchGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchGameService],
    }).compile();

    service = module.get<TwitchGameService>(TwitchGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
