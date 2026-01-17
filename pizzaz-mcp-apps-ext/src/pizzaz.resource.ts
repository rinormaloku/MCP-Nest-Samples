import { Injectable, Scope } from "@nestjs/common";
import { Resource, ResourceTemplate } from "@rekog/mcp-nest";
import { WidgetService } from "./widgets/widget.service";

/**
 * MCP Apps Extension UI Resource metadata
 * Based on SEP-1865 specification
 */
interface McpUiResourceMeta {
  csp?: {
    /** Origins for network requests (fetch/XHR/WebSocket) */
    connectDomains?: string[];
    /** Origins for static resources (images, scripts, stylesheets, fonts, media) */
    resourceDomains?: string[];
    /** Origins for nested iframes */
    frameDomains?: string[];
    /** Allowed base URIs for the document */
    baseUriDomains?: string[];
  };
  permissions?: {
    camera?: boolean;
    microphone?: boolean;
    geolocation?: boolean;
    clipboardWrite?: boolean;
  };
  /** Dedicated origin for widget */
  domain?: string;
  /** Visual boundary preference */
  prefersBorder?: boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class PizzazResourceService {
  constructor(private readonly widgetService: WidgetService) {}

  @Resource({
    name: "Show Pizza Map",
    description: "Show Pizza Map widget markup",
    mimeType: "text/html;profile=mcp-app",
    uri: "ui://widget/pizza-map",
    _meta: {
      ui: {
        csp: {
          // Allow external images from pizzaz CDN and Mapbox resources
          resourceDomains: [
            "https://persistent.oaistatic.com",
            "https://api.mapbox.com",
          ],
          // Allow Mapbox API network requests (fetch/XHR)
          connectDomains: ["https://api.mapbox.com"],
        },
        prefersBorder: true,
      } as McpUiResourceMeta,
    },
  })
  async getPizzaMap({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaMap();
    const html = await this.widgetService.render("pizza-map", data);

    return {
      contents: [
        {
          uri,
          mimeType: "text/html;profile=mcp-app",
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: [
                  "https://persistent.oaistatic.com",
                  "https://api.mapbox.com",
                ],
                connectDomains: ["https://api.mapbox.com"],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    };
  }

  @ResourceTemplate({
    name: "Show Pizza Carousel",
    description:
      "Show Pizza Carousel widget markup (supports dynamic topping filtering via path parameter)",
    mimeType: "text/html;profile=mcp-app",
    uriTemplate: "ui://widget/pizza-carousel/{topping}",
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://persistent.oaistatic.com"],
        },
        prefersBorder: true,
      } as McpUiResourceMeta,
    },
  })
  async getPizzaCarousel({ uri }: { uri: string }) {
    // Support dynamic filtering by topping from path
    const pizzaTopping = this.extractToppingFromPath(uri);

    const data = this.widgetService.getSamplePizzaCarousel(
      pizzaTopping === "all" ? null : pizzaTopping,
    );
    const html = await this.widgetService.render("pizza-carousel", data);

    return {
      contents: [
        {
          uri,
          mimeType: "text/html;profile=mcp-app",
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: ["https://persistent.oaistatic.com"],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    };
  }

  @Resource({
    name: "Show Pizza Album",
    description: "Show Pizza Album widget markup",
    mimeType: "text/html;profile=mcp-app",
    uri: "ui://widget/pizza-albums",
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://persistent.oaistatic.com"],
        },
        prefersBorder: true,
      } as McpUiResourceMeta,
    },
  })
  async getPizzaAlbums({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaAlbums();
    const html = await this.widgetService.render("pizza-albums", data);

    return {
      contents: [
        {
          uri,
          mimeType: "text/html;profile=mcp-app",
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: ["https://persistent.oaistatic.com"],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    };
  }

  @Resource({
    name: "Show Pizza List",
    description: "Show Pizza List widget markup",
    mimeType: "text/html;profile=mcp-app",
    uri: "ui://widget/pizza-list",
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://persistent.oaistatic.com"],
        },
        prefersBorder: true,
      } as McpUiResourceMeta,
    },
  })
  async getPizzaList({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaListByTopping();
    const html = await this.widgetService.render("pizza-list", data);

    return {
      contents: [
        {
          uri,
          mimeType: "text/html;profile=mcp-app",
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: ["https://persistent.oaistatic.com"],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    };
  }

  @Resource({
    name: "Show Pizza Video",
    description: "Show Pizza Video widget markup",
    mimeType: "text/html;profile=mcp-app",
    uri: "ui://widget/pizza-video",
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://persistent.oaistatic.com"],
        },
        prefersBorder: true,
      } as McpUiResourceMeta,
    },
  })
  async getPizzaVideo({ uri }: { uri: string }) {
    // Simple video placeholder - could integrate with real video player later
    const html = `
<div id="pizzaz-video-root" style="padding: 24px; font-family: system-ui;">
  <h1 style="font-size: 24px; margin-bottom: 16px;">Pizza Video</h1>
  <p style="color: #6b7280;">Video player coming soon! For now, check out the carousel or albums views.</p>
</div>
    `.trim();

    return {
      contents: [
        {
          uri,
          mimeType: "text/html;profile=mcp-app",
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: ["https://persistent.oaistatic.com"],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    };
  }

  /**
   * Extract the topping parameter from a path-based URI
   * Supports URIs like ui://widget/pizza-list/pepperoni
   * Returns 'all' if no topping is specified
   */
  private extractToppingFromPath(uri: string): string {
    try {
      // Match pattern: ui://widget/{widgetType}/{topping}
      const match = uri.match(/ui:\/\/widget\/[^/]+\/([^/?]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return "all";
    } catch (error) {
      console.error("Error parsing topping from URI:", uri, error);
      return "all";
    }
  }
}
