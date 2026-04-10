const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const express = require('express');

const server = express();
let app;

async function bootstrap() {
  if (!app) {
    const { AppModule } = require('../dist/app.module');
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: '*', credentials: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  }
  return server;
}

module.exports = async (req, res) => {
  const svr = await bootstrap();
  svr(req, res);
};
