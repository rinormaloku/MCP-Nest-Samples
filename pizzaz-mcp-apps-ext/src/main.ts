import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure Handlebars view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Enable CORS for MCP clients
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 8001);
  await app.listen(port);

  console.log(`Pizzaz MCP Apps Extension server listening on http://localhost:${port}`);
  console.log(`  SSE stream: GET http://localhost:${port}/mcp`);
  console.log(`  Message post endpoint: POST http://localhost:${port}/mcp/messages?sessionId=...`);
  console.log(`  Widget preview: http://localhost:${port}/widgets/preview`);
}

bootstrap();
