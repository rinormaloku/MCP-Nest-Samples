import { Injectable, Scope } from '@nestjs/common';
import { Resource } from '@rekog/mcp-nest';
import { WidgetService } from './widgets/widget.service';

@Injectable({ scope: Scope.REQUEST })
export class PizzazResourceService {
  constructor(private readonly widgetService: WidgetService) {}
  // Static resource - no parameters needed
  @Resource({
    name: 'Show Pizza Map',
    description: 'Show Pizza Map widget markup',
    mimeType: 'text/html+skybridge',
    uri: 'ui://widget/pizza-map.html',
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-map.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a map',
      'openai/toolInvocation/invoked': 'Served a fresh map',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async getPizzaMap({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaMap();
    const html = await this.widgetService.render('pizza-map', data);

    return {
      contents: [
        {
          uri,
          mimeType: 'text/html+skybridge',
          text: html,
        },
      ],
    };
  }

  // Static resource - no parameters needed
  @Resource({
    name: 'Show Pizza Carousel',
    description: 'Show Pizza Carousel widget markup',
    mimeType: 'text/html+skybridge',
    uri: 'ui://widget/pizza-carousel.html',
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-carousel.html',
      'openai/toolInvocation/invoking': 'Carousel some spots',
      'openai/toolInvocation/invoked': 'Served a fresh carousel',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async getPizzaCarousel({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaCarousel();
    const html = await this.widgetService.render('pizza-carousel', data);

    return {
      contents: [
        {
          uri,
          mimeType: 'text/html+skybridge',
          text: html,
        },
      ],
    };
  }

  // Static resource - no parameters needed
  @Resource({
    name: 'Show Pizza Album',
    description: 'Show Pizza Album widget markup',
    mimeType: 'text/html+skybridge',
    uri: 'ui://widget/pizza-albums.html',
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-albums.html',
      'openai/toolInvocation/invoking': 'Hand-tossing an album',
      'openai/toolInvocation/invoked': 'Served a fresh album',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async getPizzaAlbums({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaAlbums();
    const html = await this.widgetService.render('pizza-albums', data);

    return {
      contents: [
        {
          uri,
          mimeType: 'text/html+skybridge',
          text: html,
        },
      ],
    };
  }

  // Static resource - no parameters needed
  @Resource({
    name: 'Show Pizza List',
    description: 'Show Pizza List widget markup',
    mimeType: 'text/html+skybridge',
    uri: 'ui://widget/pizza-list.html',
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-list.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a list',
      'openai/toolInvocation/invoked': 'Served a fresh list',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
    },
  })
  async getPizzaList({ uri }: { uri: string }) {
    const data = this.widgetService.getSamplePizzaListByTopping('all');
    const html = await this.widgetService.render('pizza-list', data);

    return {
      contents: [
        {
          uri,
          mimeType: 'text/html+skybridge',
          text: html,
        },
      ],
    };
  }

  // Static resource - no parameters needed
  @Resource({
    name: 'Show Pizza Video',
    description: 'Show Pizza Video widget markup',
    mimeType: 'text/html+skybridge',
    uri: 'ui://widget/pizza-video.html',
    _meta: {
      'openai/outputTemplate': 'ui://widget/pizza-video.html',
      'openai/toolInvocation/invoking': 'Hand-tossing a video',
      'openai/toolInvocation/invoked': 'Served a fresh video',
      'openai/widgetAccessible': true,
      'openai/resultCanProduceWidget': true,
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
          mimeType: 'text/html+skybridge',
          text: html,
        },
      ],
    };
  }
}
