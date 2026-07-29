import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from '../../services/scraper/scraper.service';

@Controller('judicial')
export class JudicialController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('buscar')
  async consultar(
    @Query('cedula') cedula: string,
    @Query('tipo') tipo: number 
  ) {
    if (!cedula) {
      return { success: false, message: 'La cédula es requerida' };
    }
    return await this.scraperService.buscarProcesoJudicial(cedula,tipo);
  }
}