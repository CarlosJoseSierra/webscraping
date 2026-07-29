import { Test, TestingModule } from '@nestjs/testing';
import { ScraperControllerController } from './scraper-controller.controller';

describe('ScraperControllerController', () => {
  let controller: ScraperControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperControllerController],
    }).compile();

    controller = module.get<ScraperControllerController>(ScraperControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
