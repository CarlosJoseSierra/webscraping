import { Test, TestingModule } from '@nestjs/testing';
import { JudicialController } from './judicial.controller';

describe('JudicialController', () => {
  let controller: JudicialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JudicialController],
    }).compile();

    controller = module.get<JudicialController>(JudicialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
