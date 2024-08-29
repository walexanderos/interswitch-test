import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './commons/exceptions/exception.filter';
import { AppInterceptor } from './commons/interceptors/app.interceptor';
import { AppConfigService } from './config/app/app.service';

async function bootstrap() {

  // Creates a nestjs express powered application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get application configurations
  const appConfig = app.get<AppConfigService>(AppConfigService);

  // set url prefix for all routes
  const prefixUrl = 'api/v1';
  app.setGlobalPrefix(prefixUrl);

  // enable cross origin for all request to REST services
  app.enableCors({ origin: '*' });
  
  // Build and configure a swagger autogenerated document
  const config = new DocumentBuilder()
    .setTitle('Interswitch')
    .addServer(appConfig.url)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    ignoreGlobalPrefix: true,
  };

  const docUrl = `api/doc`;
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup(docUrl, app, document);

  //enable request validation on all routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // enable interceptors and exceptions on all routes
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new AppInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());

  // set application port
  await app.listen(appConfig.port);

  console.log(`Api Documentation: ${await app.getUrl()}/${docUrl}`);
}
bootstrap();
