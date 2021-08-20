import { Test, TestingModule } from '@nestjs/testing';
import { CustomCommandService } from './custom-command.service';

describe('CustomCommandService', () => {
  let service: CustomCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomCommandService],
    }).compile();

    service = module.get<CustomCommandService>(CustomCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
