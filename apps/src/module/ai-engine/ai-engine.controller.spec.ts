import { Test, TestingModule } from '@nestjs/testing';
import { AiEngineController } from './ai-engine.controller';
import { AiEngineService } from './ai-engine.service';

describe('AiEngineController', () => {
  let controller: AiEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiEngineController],
      providers: [AiEngineService],
    }).compile();

    controller = module.get<AiEngineController>(AiEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
