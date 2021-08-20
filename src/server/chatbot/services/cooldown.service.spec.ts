import { Test, TestingModule } from '@nestjs/testing';
import { CooldownService } from './cooldown.service';

describe('CooldownService', () => {
  let service: CooldownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CooldownService],
    }).compile();

    service = module.get<CooldownService>(CooldownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
