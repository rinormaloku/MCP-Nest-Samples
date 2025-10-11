import { Module, OnModuleInit } from '@nestjs/common';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import { randomUUID } from 'crypto';
import { PizzazToolService } from './pizzaz.tool';
import { PizzazResourceService } from './pizzaz.resource';
import { WidgetService } from './widgets/widget.service';
import { WidgetPreviewController } from './widgets/widget-preview.controller';
import { registerHandlebarsHelpers } from './widgets/handlebars-helpers';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'pizzaz-nestjs',
      version: '0.1.0',
      transport: [McpTransportType.SSE],
      sseEndpoint: '/mcp',
      messagesEndpoint: '/mcp/messages',
      capabilities: {
        resources: {},
        tools: {},
      },
      streamableHttp: {
        enableJsonResponse: false,
        sessionIdGenerator: () => randomUUID(),
        statelessMode: false,
      },
      sse: {
        pingEnabled: true,
        pingIntervalMs: 30000,
      },
    }),
  ],
  controllers: [WidgetPreviewController],
  providers: [PizzazToolService, PizzazResourceService, WidgetService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // Register Handlebars helpers when module initializes
    registerHandlebarsHelpers();
  }
}
