import { Test, TestingModule } from '@nestjs/testing';
import { ModToolsController } from './mod-tools.controller';

describe('ModToolsController', () => {
  let controller: ModToolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModToolsController],
    }).compile();

    controller = module.get<ModToolsController>(ModToolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
