import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ScraperService } from '../../services/scraper/scraper.service';

@Controller('interpol')
export class InterpolController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('buscar')
  async buscarNoticiaRoja(
    @Query('nombre') nombre: string,
    @Query('apellido') apellido: string,
  ) {
    //if (!nombre || !apellido) {
      //throw new HttpException('Nombre y apellido son obligatorios', HttpStatus.BAD_REQUEST);
    //}

    return await this.scraperService.buscarEnInterpol(apellido, nombre,2);
  }
}