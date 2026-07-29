import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ScraperService } from '../../services/scraper/scraper.service';

@Controller('scraper-controller')
export class ScraperControllerController {
    constructor(private readonly scraperService: ScraperService) {}
    @Get('consultar')
    async consultarTodo(@Query('cedula') cedula:string,@Query('tipoConsulta') tipoConsulta: number) 
    {
        let ruc, nombreCompleto,apellidoCompleto;
        if(cedula.length==10){
            ruc = cedula + '001';
        }
        else{
            ruc = cedula;
        }
        //nombreCompleto = nombre.toUpperCase() +' '+ apellido.toUpperCase();
        //apellidoCompleto = apellido.toUpperCase() + ' '+ nombre.toUpperCase();
       /* const [
            sri
        ] = await Promise.all([
            
            this.scraperService.obtenerDatosConsultaSRI(ruc, tipoConsulta)
        ]);

        return {
            
            sri
        };*/
        return this.scraperService.obtenerDatosConsultaSRI(ruc, tipoConsulta)
    }
}
