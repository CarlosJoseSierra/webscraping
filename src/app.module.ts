import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperController } from './controllers/scraper/scraper.controller';
import { ScraperService } from './services/scraper/scraper.service';
import { Consulta } from './entities/consulta/consulta'; // Asegúrate de importar la entidad también
import { JudicialController } from './controllers/judicial/judicial.controller';
import { InterpolController } from './controllers/interpol/interpol.controller';
import { FiscaliaController } from './controllers/fiscalia/fiscalia.controller';
import { HomonimoController } from './controllers/homonimo/homonimo.controller';
import { DatabaseService } from './services/database/database.service';
import { Homonimo } from './entities/homonimos/homonimos';
import { Ofac } from './entities/ofac/ofac';
import { Onu } from './entities/onu/onu';
import { Pep } from './entities/pep/pep';
import { Sentenciados } from './entities/sentenciados/sentenciados';
import { ScraperControllerController } from './controllers/scraper-controller/scraper-controller.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    // 2. Importa la entidad para que TypeORM la reconozca
    TypeOrmModule.forFeature([Consulta,Homonimo, 
      Ofac, 
      Onu, 
      Pep, 
      Sentenciados]),
  ],
  // 3. REGÍSTRALOS AQUÍ
  controllers: [ScraperController, JudicialController, InterpolController, FiscaliaController, HomonimoController
    ,ScraperControllerController
  ],
  providers: [ScraperService, DatabaseService],
  
})
export class AppModule {}