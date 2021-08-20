import { Test, TestingModule } from '@nestjs/testing';
import { CapsProtectionService } from './caps-protection.service';

describe('CapsProtectionService', () => {
  let service: CapsProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapsProtectionService],
    }).compile();

    service = module.get<CapsProtectionService>(CapsProtectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
