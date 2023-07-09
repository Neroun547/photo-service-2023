import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {NestExpressApplication} from "@nestjs/platform-express";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(3333);
}
bootstrap();
