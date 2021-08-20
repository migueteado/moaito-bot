import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatbotService } from './chatbot/services/chatbot.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const botService = app
    .select(ChatbotModule)
    .get(ChatbotService, { strict: true });

  await botService.init();
  botService.connect();

  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Moaito Bot')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(9000);
}
bootstrap();
