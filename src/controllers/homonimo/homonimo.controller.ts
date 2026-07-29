import { Controller, Get, Query } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';

@Controller('homonimo')
export class HomonimoController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('buscar')
  async buscar(@Query('q') q: string) {
    return await this.databaseService.buscarHomonimo(q,1);
  }
}