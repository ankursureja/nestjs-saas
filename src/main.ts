import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/interceptor/error.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    credentials: true,
    origin: [/\.localhost:3000$/]
  });
  app.useGlobalPipes(new ValidationPipe());

  /* Catch All Exception */
  app.useGlobalFilters(new AllExceptionsFilter());

  /* Swagger Documentation */
  const config = new DocumentBuilder()
    .setTitle('Target Align')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access_token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // Serve Static Files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
