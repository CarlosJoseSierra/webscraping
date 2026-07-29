import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ScraperService } from '../../services/scraper/scraper.service';

@Controller('fiscalia')
export class FiscaliaController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('buscar')
  async buscarDenuncias(@Query('nombres') nombres: string) {
    if (!nombres) {
      throw new HttpException('El parámetro nombres es obligatorio', HttpStatus.BAD_REQUEST);
    }

    // Llamada al método que creamos en el servicio
    const resultado = await this.scraperService.buscarDenunciasFiscalia(nombres);

    if (!resultado.success) {
      throw new HttpException(resultado.message, HttpStatus.NOT_FOUND);
    }

    return resultado;
  }
}