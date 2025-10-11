import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import type { Request } from 'express';

type WidgetMeta = {
  'openai/outputTemplate': string;
  'openai/toolInvocation/invoking': string;
  'openai/toolInvocation/invoked': string;
  'openai/widgetAccessible': boolean;
  'openai/resultCanProduceWidget': boolean;
};

@Injectable()
export class PizzazToolService {
  @Tool({
    name: 'pizza-map',
    description: 'Show Pizza Map',
    parameters: z.object({
      pizzaTopping: z.string().describe('Topping to mention when rendering the widget.'),
    }),
    annotations: {
      title: 'Show Pizza Map',
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-map.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a map',
      'openai/toolInvocation/invoked': 'Served a fresh map',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async showPizzaMap(
    { pizzaTopping }: { pizzaTopping: string },
    context: Context,
    request: Request,
  ) {
    return {
      content: [
        {
          type: 'text',
          text: 'Rendered a pizza map!',
        },
      ],
      structuredContent: {
        pizzaTopping,
      },
    };
  }

  @Tool({
    name: 'pizza-carousel',
    description: 'Show Pizza Carousel',
    parameters: z.object({
      pizzaTopping: z.string().describe('Topping to mention when rendering the widget.'),
    }),
    annotations: {
      title: 'Show Pizza Carousel',
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-carousel.html',
      'openai/toolInvocation/invoking': 'Carousel some spots',
      'openai/toolInvocation/invoked': 'Served a fresh carousel',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async showPizzaCarousel(
    { pizzaTopping }: { pizzaTopping: string },
    context: Context,
    request: Request,
  ) {
    return {
      content: [
        {
          type: 'text',
          text: 'Rendered a pizza carousel!',
        },
      ],
      structuredContent: {
        pizzaTopping,
      },
    };
  }

  @Tool({
    name: 'pizza-albums',
    description: 'Show Pizza Album',
    parameters: z.object({
      pizzaTopping: z.string().describe('Topping to mention when rendering the widget.'),
    }),
    annotations: {
      title: 'Show Pizza Album',
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-albums.html',
      'openai/toolInvocation/invoking': 'Hand-tossing an album',
      'openai/toolInvocation/invoked': 'Served a fresh album',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async showPizzaAlbums(
    { pizzaTopping }: { pizzaTopping: string },
    context: Context,
    request: Request,
  ) {
    return {
      content: [
        {
          type: 'text',
          text: 'Rendered a pizza album!',
        },
      ],
      structuredContent: {
        pizzaTopping,
      },
    };
  }

  @Tool({
    name: 'pizza-list',
    description: 'Show Pizza List',
    parameters: z.object({
      pizzaTopping: z.string().describe('Topping to mention when rendering the widget.'),
    }),
    annotations: {
      title: 'Show Pizza List',
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-list.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a list',
      'openai/toolInvocation/invoked': 'Served a fresh list',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async showPizzaList(
    { pizzaTopping }: { pizzaTopping: string },
    context: Context,
    request: Request,
  ) {
    return {
      content: [
        {
          type: 'text',
          text: 'Rendered a pizza list!',
        },
      ],
      structuredContent: {
        pizzaTopping,
      },
    };
  }

  @Tool({
    name: 'pizza-video',
    description: 'Show Pizza Video',
    parameters: z.object({
      pizzaTopping: z.string().describe('Topping to mention when rendering the widget.'),
    }),
    annotations: {
      title: 'Show Pizza Video',
      readOnlyHint: true,
      idempotentHint: true,
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-video.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a video',
      'openai/toolInvocation/invoked': 'Served a fresh video',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async showPizzaVideo(
    { pizzaTopping }: { pizzaTopping: string },
    context: Context,
    request: Request,
  ) {
    return {
      content: [
        {
          type: 'text',
          text: 'Rendered a pizza video!',
        },
      ],
      structuredContent: {
        pizzaTopping,
      },
    };
  }
}
