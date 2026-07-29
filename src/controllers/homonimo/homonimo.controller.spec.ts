import { Test, TestingModule } from '@nestjs/testing';
import { HomonimoController } from './homonimo.controller';

describe('HomonimoController', () => {
  let controller: HomonimoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomonimoController],
    }).compile();

    controller = module.get<HomonimoController>(HomonimoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
