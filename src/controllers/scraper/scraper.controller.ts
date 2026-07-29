import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ScraperService } from '../../services/scraper/scraper.service';
import { DatabaseService } from 'src/services/database/database.service';

@Controller('scraper')
export class ScraperController {
    constructor(private readonly databaseService: DatabaseService,private readonly scraperService: ScraperService) {}
    @Get('consultar-todo')
    async consultarTodo(@Query('cedula') cedula: string, @Query('nombre') nombre: string,@Query('apellido') apellido: string,@Query('tipoConsulta') tipoConsulta: number) 
    {
        let ruc,apellidoCompleto, cedulaUnica;
        
        if(cedula.length==10){
            ruc = cedula + '001';
        }
        else{
            ruc = cedula;
        }
            
        apellidoCompleto = apellido.toUpperCase() + ' '+ nombre.toUpperCase();
        if (!cedula ) {
            ruc = apellidoCompleto;
        }
        const criterioJudicial =
        Number(tipoConsulta) === 1
          ? cedula
          : apellidoCompleto;
       
        const [
            baseHomonimo, 
            baseOnu, 
            baseOfac, 
            basePep, 
            baseSentenciado, 
            sri, 
            judicial, 
            interpol
        ] = await Promise.all([
            this.databaseService.buscarHomonimo(cedula || apellidoCompleto,tipoConsulta),
            this.databaseService.buscarOnu(apellidoCompleto,tipoConsulta),
            this.databaseService.buscarOfac(apellidoCompleto,tipoConsulta),
            this.databaseService.buscarPep(cedula || apellidoCompleto,tipoConsulta),
            this.databaseService.buscarSentenciados(cedula || apellidoCompleto, tipoConsulta),
            this.scraperService.obtenerDatosConsultaSRI(ruc, tipoConsulta),
            this.scraperService.buscarProcesoJudicial(criterioJudicial, tipoConsulta),
            this.scraperService.buscarEnInterpol(apellido, nombre,tipoConsulta)
        ]);

        return {
            baseHomonimo, 
            baseOnu, 
            baseOfac, 
            basePep, 
            baseSentenciado,
            sri, 
            judicial, 
            interpol
        };
    }
}
