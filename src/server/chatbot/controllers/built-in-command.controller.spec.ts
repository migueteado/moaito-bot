import { Test, TestingModule } from '@nestjs/testing';
import { BuiltInCommandController } from './built-in-command.controller';

describe('BuiltInCommandController', () => {
  let controller: BuiltInCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuiltInCommandController],
    }).compile();

    controller = module.get<BuiltInCommandController>(BuiltInCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
