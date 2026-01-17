import { Module, OnModuleInit } from '@nestjs/common';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import { PizzazToolService } from './pizzaz.tool';
import { PizzazResourceService } from './pizzaz.resource';
import { WidgetService } from './widgets/widget.service';
import { WidgetPreviewController } from './widgets/widget-preview.controller';
import { registerHandlebarsHelpers } from './widgets/handlebars-helpers';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'pizzaz-mcp-apps-ext',
      version: '0.1.0',
      transport: [McpTransportType.STREAMABLE_HTTP],
      capabilities: {
        resources: {},
        tools: {},
        experimental: {
          // Advertise support for MCP Apps Extension (io.modelcontextprotocol/ui)
          extensions: {
            'io.modelcontextprotocol/ui': {
              mimeTypes: ['text/html;profile=mcp-app'],
            },
          },
        },
      },
      streamableHttp: {
        enableJsonResponse: false,
        sessionIdGenerator: undefined,  // No session tracking in stateless mode
        statelessMode: true,              // Enable stateless mode - no Mcp-Session-Id required
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
