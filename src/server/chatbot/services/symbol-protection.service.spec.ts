import { Test, TestingModule } from '@nestjs/testing';
import { SymbolProtectionService } from './symbol-protection.service';

describe('SymbolProtectionService', () => {
  let service: SymbolProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymbolProtectionService],
    }).compile();

    service = module.get<SymbolProtectionService>(SymbolProtectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
