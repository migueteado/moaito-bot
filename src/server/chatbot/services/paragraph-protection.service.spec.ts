import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphProtectionService } from './paragraph-protection.service';

describe('ParagraphProtectionService', () => {
  let service: ParagraphProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagraphProtectionService],
    }).compile();

    service = module.get<ParagraphProtectionService>(ParagraphProtectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
