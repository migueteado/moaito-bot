import { Test, TestingModule } from '@nestjs/testing';
import { WordProtectionService } from './word-protection.service';

describe('WordProtectionService', () => {
  let service: WordProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordProtectionService],
    }).compile();

    service = module.get<WordProtectionService>(WordProtectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
