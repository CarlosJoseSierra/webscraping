import { Test, TestingModule } from '@nestjs/testing';
import { InterpolController } from './interpol.controller';

describe('InterpolController', () => {
  let controller: InterpolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterpolController],
    }).compile();

    controller = module.get<InterpolController>(InterpolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
