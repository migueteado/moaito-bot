import { Test, TestingModule } from '@nestjs/testing';
import { TwitchTokenService } from './twitch-token.service';

describe('TwitchTokenService', () => {
  let service: TwitchTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchTokenService],
    }).compile();

    service = module.get<TwitchTokenService>(TwitchTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
