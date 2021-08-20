import { Test, TestingModule } from '@nestjs/testing';
import { LinkProtectionService } from './link-protection.service';

describe('LinkProtectionService', () => {
  let service: LinkProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkProtectionService],
    }).compile();

    service = module.get<LinkProtectionService>(LinkProtectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
