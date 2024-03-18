import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { HttpExceptionFilter } from './utils/exception-filter/http-exception-filter';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    logger: ['log', 'fatal', 'error', 'warn', 'debug'],
  });

  const config = new DocumentBuilder()
    .setTitle('FINGOO Documentation')
    .setDescription('FINGOO의 API 문서입니다.')
    .setVersion('0.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // codespace 환경에서 포트포워딩을 위해 설정
  const applicationHost =
    process.env.CODESPACES === 'true'
      ? 'https://' + process.env.CODESPACE_NAME + '-3000.app.github.dev'
      : 'http://localhost';

  console.log('applicationHost', applicationHost);
  app.enableCors({
    origin: applicationHost,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(8000);

  app.useGlobalGuards(new AuthGuard());
}
bootstrap();
