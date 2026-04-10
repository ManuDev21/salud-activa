const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const express = require('express');
const path = require('path');

const server = express();
let app;

async function bootstrap() {
  if (!app) {
    console.log('Starting NestJS bootstrap...');
    console.log('CWD:', process.cwd());
    console.log('__dirname:', __dirname);
    const distPath = path.join(__dirname, '..', 'dist', 'app.module');
    console.log('Dist path:', distPath);
    const { AppModule } = require(distPath);
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: '*', credentials: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    console.log('NestJS bootstrap complete');
  }
  return server;
}

module.exports = async (req, res) => {
  try {
    const svr = await bootstrap();
    svr(req, res);
  } catch (error) {
    console.error('Bootstrap error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
