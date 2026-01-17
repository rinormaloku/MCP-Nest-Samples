# Pizzaz MCP Apps Extension

An implementation of the **MCP Apps Extension (SEP-1865)** specification using **[@rekog/mcp-nest](https://github.com/rekog/mcp-nest)** - a NestJS module for the MCP protocol.

This project demonstrates how to build interactive UI applications using the new MCP Apps Extension standard, which enables servers to deliver interactive user interfaces to hosts through the `ui://` URI scheme and standardized metadata.

## What is MCP Apps Extension?

The MCP Apps Extension (SEP-1865) is a formal specification that enables MCP servers to deliver rich, interactive user interfaces to hosts. Key features:

- **Predeclared UI Resources**: Resources use the `ui://` URI scheme
- **Tool-UI Linkage**: Tools reference UI resources via `_meta.ui.resourceUri`
- **Standardized MIME Type**: `text/html;profile=mcp-app`
- **Security Model**: Mandatory CSP (Content Security Policy) enforcement
- **Bidirectional Communication**: UI iframes communicate using MCP JSON-RPC protocol
- **Extension Negotiation**: Hosts advertise support via `io.modelcontextprotocol/ui` capability

## Usage

**1. Install and run**

```bash
cd pizzaz-mcp-apps-ext
npm i
npm start
```

**2. Test the connection**

Open [test-connection.html](test-connection.html) in your browser to verify the MCP server is working correctly. This interactive test tool will help you:
- Test the initialize handshake
- List available tools and resources
- Call tools and see responses
- Debug connection issues

**3. Local development preview**

View all widgets at: <http://localhost:8001/widgets/preview>

This preview page lets you view and test each widget individually during development.

**4. Connect to MCP-compatible hosts**

The server runs in **stateless mode** and exposes MCP endpoints at:
- Main endpoint: `POST http://localhost:8001/mcp`

Configure your MCP-compatible host to connect to this endpoint.

**Important**: The Streamable HTTP transport requires clients to send:
```
Accept: application/json, text/event-stream
```

**Note**: This server runs in stateless mode (no session management), so each request is independent and doesn't require `Mcp-Session-Id` headers.

See [DEBUG.md](DEBUG.md) for troubleshooting and [FIXES.md](FIXES.md) for configuration details.

## Architecture

### MCP Apps Extension Compliance

This implementation follows SEP-1865 specification:

#### 1. Extension Capability Negotiation

In [app.module.ts](src/app.module.ts), we advertise support for the MCP Apps Extension:

```typescript
capabilities: {
  resources: {},
  tools: {},
  extensions: {
    'io.modelcontextprotocol/ui': {
      mimeTypes: ['text/html;profile=mcp-app'],
    },
  },
}
```

#### 2. Tools with UI Metadata

Tools in [pizzaz.tool.ts](src/pizzaz.tool.ts) use the new `_meta.ui` format:

```typescript
@Tool({
  name: 'pizza-map',
  description: 'Show Pizza Map',
  parameters: z.object({
    pizzaTopping: z.string(),
  }),
  _meta: {
    ui: {
      resourceUri: 'ui://widget/pizza-map',  // Links to UI resource
      visibility: ['model', 'app'],          // Accessible by both agent and app
    },
  },
})
async showPizzaMap({ pizzaTopping }: { pizzaTopping: string }) {
  return {
    content: [{ type: 'text', text: 'Rendered a pizza map!' }],
    structuredContent: { pizzaTopping },
  };
}
```

**Key differences from OpenAI Apps SDK:**
- Uses nested `_meta.ui.resourceUri` instead of flat `_meta['openai/outputTemplate']`
- Adds `visibility` array to control tool access (model, app, or both)
- URI scheme is `ui://` without `.html` extension

#### 3. UI Resources with CSP Metadata

Resources in [pizzaz.resource.ts](src/pizzaz.resource.ts) use the spec-compliant format:

```typescript
@Resource({
  name: 'Show Pizza Map',
  description: 'Show Pizza Map widget markup',
  mimeType: 'text/html;profile=mcp-app',  // Standard MIME type
  uri: 'ui://widget/pizza-map',            // ui:// scheme
  _meta: {
    ui: {
      csp: {
        // Declare external domains for CSP enforcement
        resourceDomains: ['https://persistent.oaistatic.com'],
      },
      prefersBorder: true,  // Visual preference hint
    },
  },
})
async getPizzaMap({ uri }: { uri: string }) {
  const data = this.widgetService.getSamplePizzaMap();
  const html = await this.widgetService.render('pizza-map', data);

  return {
    contents: [{
      uri,
      mimeType: 'text/html;profile=mcp-app',
      text: html,
    }],
  };
}
```

**CSP Configuration:**
- `resourceDomains`: Origins for images, scripts, styles, fonts
- `connectDomains`: Origins for fetch/XHR/WebSocket (not used in this example)
- `frameDomains`: Origins for nested iframes (not used in this example)
- `permissions`: Request browser capabilities (camera, microphone, etc.)

#### 4. How Tools and Resources Connect

The `ui.resourceUri` in a tool's `_meta` links to a resource's `uri`:

```typescript
// Tool metadata points to resource URI
_meta: {
  ui: {
    resourceUri: 'ui://widget/pizza-map',
  }
}

// Resource URI matches
@Resource({
  uri: 'ui://widget/pizza-map',
})
```

When a host invokes the tool, it fetches the resource at the specified URI to render the widget.

## Key Differences from OpenAI Apps SDK

| Feature | OpenAI Apps SDK | MCP Apps Extension |
|---------|-----------------|-------------------|
| Extension ID | N/A (proprietary) | `io.modelcontextprotocol/ui` |
| MIME Type | `text/html+skybridge` | `text/html;profile=mcp-app` |
| Tool Metadata | `openai/outputTemplate` | `ui.resourceUri` |
| Tool Visibility | `openai/widgetAccessible` | `ui.visibility` array |
| Resource URI | `ui://widget/name.html` | `ui://widget/name` |
| CSP Declaration | N/A | `ui.csp` with domain arrays |
| Security Model | Implicit | Explicit CSP enforcement |

## Available Widgets

Each widget demonstrates different UI patterns:

- **pizza-map** - Interactive map with location markers and sidebar
- **pizza-carousel** - Swipeable image carousel with touch support
- **pizza-list** - Ranked list with filtering and save functionality
- **pizza-albums** - Photo album grid with preview thumbnails
- **pizza-video** - Placeholder for video player (simple example)

Preview all widgets at: <http://localhost:8001/widgets/preview>

## MCP Apps Extension Benefits

1. **Standardization**: Open specification means any MCP host can support apps
2. **Security**: Mandatory CSP enforcement with explicit domain declarations
3. **Auditability**: All UI resources are predeclared and inspectable
4. **Performance**: Hosts can prefetch UI templates before tool execution
5. **Flexibility**: Supports graceful degradation for text-only hosts

## Technical Stack

- **NestJS**: TypeScript framework for building efficient server applications
- **@rekog/mcp-nest**: MCP protocol adapter for NestJS with decorators
- **Handlebars**: Template engine for rendering HTML widgets
- **Zod**: Schema validation for tool parameters
- **MCP SDK**: Official Model Context Protocol SDK

## Project Structure

```
pizzaz-mcp-apps-ext/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # NestJS module with MCP config
│   ├── pizzaz.tool.ts             # Tool definitions with UI metadata
│   ├── pizzaz.resource.ts         # UI resource definitions
│   └── widgets/
│       ├── widget.service.ts      # Template rendering service
│       ├── handlebars-helpers.ts  # Custom Handlebars helpers
│       └── widget-preview.controller.ts  # Development preview
├── views/
│   └── widgets/                   # Handlebars templates
│       ├── pizza-map.hbs
│       ├── pizza-carousel.hbs
│       ├── pizza-list.hbs
│       └── pizza-albums.hbs
├── package.json
├── tsconfig.json
└── README.md
```

## References

- [MCP Apps Extension Specification (SEP-1865)](../mcp-apps-spec.mdx)
- [@rekog/mcp-nest Documentation](https://github.com/rekog/mcp-nest)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Comparison with OpenAI Apps SDK Implementation

See [pizzaz-openai-apps-sdk](../pizzaz-openai-apps-sdk) for the OpenAI Apps SDK implementation using the same widgets. This project demonstrates how to migrate from the proprietary OpenAI format to the open MCP Apps Extension standard.

## License

MIT
