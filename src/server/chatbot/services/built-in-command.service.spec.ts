import { Test, TestingModule } from '@nestjs/testing';
import { BuiltInCommandService } from './built-in-command.service';

describe('BuiltInCommandService', () => {
  let service: BuiltInCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuiltInCommandService],
    }).compile();

    service = module.get<BuiltInCommandService>(BuiltInCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
