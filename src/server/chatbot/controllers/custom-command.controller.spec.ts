import { Test, TestingModule } from '@nestjs/testing';
import { CustomCommandController } from './custom-command.controller';

describe('CustomCommandController', () => {
  let controller: CustomCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomCommandController],
    }).compile();

    controller = module.get<CustomCommandController>(CustomCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
