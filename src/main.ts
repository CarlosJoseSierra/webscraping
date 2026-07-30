/*import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    //origin: '*', // En producción, cámbialo por tu dominio específico (ej: 'https://tuapp.com')
    origin: true,
    //methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Aplicación ejecutándose en el puerto ${port}`);
}
bootstrap();*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;

  console.log('PORT recibido de Railway:', process.env.PORT);
  console.log('Puerto utilizado:', port);

  await app.listen(port, '0.0.0.0');

  console.log(`Servidor iniciado en 0.0.0.0:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error iniciando NestJS:', error);
  process.exit(1);
});