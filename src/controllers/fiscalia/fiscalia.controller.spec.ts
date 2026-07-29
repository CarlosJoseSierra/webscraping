import { Test, TestingModule } from '@nestjs/testing';
import { FiscaliaController } from './fiscalia.controller';

describe('FiscaliaController', () => {
  let controller: FiscaliaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscaliaController],
    }).compile();

    controller = module.get<FiscaliaController>(FiscaliaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
