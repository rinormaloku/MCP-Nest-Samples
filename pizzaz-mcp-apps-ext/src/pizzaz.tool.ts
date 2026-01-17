import { Injectable } from "@nestjs/common";
import { Tool, Context } from "@rekog/mcp-nest";
import { z } from "zod";
import type { Request } from "express";

/**
 * MCP Apps Extension metadata for tools
 * Based on SEP-1865 specification
 */
type McpUiToolMeta = {
  ui?: {
    /** URI of UI resource for rendering tool results */
    resourceUri?: string;
    /**
     * Who can access this tool. Default: ["model", "app"]
     * - "model": Tool visible to and callable by the agent
     * - "app": Tool callable by the app from this server only
     */
    visibility?: Array<"model" | "app">;
  };
};

@Injectable()
export class PizzazToolService {
  @Tool({
    name: "pizza-map",
    description: "Show Pizza Map",
    annotations: {
      title: "Show Pizza Map",
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      ui: {
        resourceUri: "ui://widget/pizza-map",

        visibility: ["model", "app"],
      },
    } as McpUiToolMeta,
  })
  async showPizzaMap() {
    return {
      content: [
        {
          type: "text",
          text: "Rendered a pizza map!",
        },
      ],
    };
  }

  @Tool({
    name: "pizza-carousel",
    description: "Show Pizza Carousel",
    parameters: z.object({
      topping: z
        .string()
        .optional()
        .describe("Topping to filter when rendering the widget."),
    }),
    outputSchema: z.object({
      topping: z.string(),
    }),
    annotations: {
      title: "Show Pizza Carousel",
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      ui: {
        resourceUri: "ui://widget/pizza-carousel/{topping}",
        visibility: ["model", "app"],
      },
    } as McpUiToolMeta,
  })
  async showPizzaCarousel({ topping }: { topping?: string }) {
    return {
      content: [
        {
          type: "text",
          text: "Rendered a pizza carousel!",
        },
      ],
      structuredContent: {
        topping,
      },
    };
  }

  @Tool({
    name: "pizza-albums",
    description: "Show Pizza Album",
    annotations: {
      title: "Show Pizza Album",
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      ui: {
        resourceUri: "ui://widget/pizza-albums",
        visibility: ["model", "app"],
      },
    } as McpUiToolMeta,
  })
  async showPizzaAlbums() {
    return {
      content: [
        {
          type: "text",
          text: "Rendered a pizza album!",
        },
      ],
    };
  }

  @Tool({
    name: "pizza-list",
    description: "Show Pizza List",
    annotations: {
      title: "Show Pizza List",
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      ui: {
        resourceUri: "ui://widget/pizza-list",
        visibility: ["model", "app"],
      },
    } as McpUiToolMeta,
  })
  async showPizzaList() {
    return {
      content: [
        {
          type: "text",
          text: "Rendered a pizza list!",
        },
      ],
    };
  }

  @Tool({
    name: "pizza-video",
    description: "Show Pizza Video",
    annotations: {
      title: "Show Pizza Video",
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      ui: {
        resourceUri: "ui://widget/pizza-video",
        visibility: ["model", "app"],
      },
    } as McpUiToolMeta,
  })
  async showPizzaVideo() {
    return {
      content: [
        {
          type: "text",
          text: "Rendered a pizza video!",
        },
      ],
    };
  }
}
