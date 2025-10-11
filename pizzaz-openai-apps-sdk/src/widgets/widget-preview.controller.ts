import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { WidgetService } from './widget.service';

@Controller('widgets')
export class WidgetPreviewController {
  constructor(private readonly widgetService: WidgetService) {}

  /**
   * Preview page showing all available widgets
   * GET /widgets/preview
   */
  @Get('preview')
  async getPreviewIndex(@Res() res: Response) {
    const widgets = this.widgetService.getAllWidgetExamples();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Gallery - Local Development</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 48px;
    }

    .header h1 {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 12px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header p {
      font-size: 18px;
      opacity: 0.9;
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .widget-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .widget-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    .widget-card h3 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .widget-card p {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .widget-card .view-button {
      display: inline-block;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .widget-card:hover .view-button {
      background: #2563eb;
    }

    .info-box {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .info-box h2 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 16px;
    }

    .info-box p {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .info-box code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      color: #1f2937;
    }

    .endpoint-list {
      list-style: none;
      margin-top: 20px;
    }

    .endpoint-list li {
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 8px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      color: #374151;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-left: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 Pizza Widget Gallery</h1>
      <p>NestJS Template-Based Widgets - No CDN Required</p>
    </div>

    <div class="widget-grid">
      ${widgets
        .map(
          (widget) => `
        <a href="/widgets/preview/${widget.template}" class="widget-card">
          <h3>${widget.name}</h3>
          <p>${widget.description}</p>
          <span class="view-button">View Widget →</span>
        </a>
      `,
        )
        .join('')}
    </div>

    <div class="info-box">
      <h2>🚀 Quick Start</h2>
      <p>
        These widgets are rendered using <strong>Handlebars templates</strong> directly in NestJS.
        No build process, no external CDN, just pure server-side rendering with dynamic data.
      </p>
      <p>
        <strong>Available Endpoints:</strong>
      </p>
      <ul class="endpoint-list">
        ${widgets
          .map(
            (widget) => `
          <li>GET /widgets/preview/${widget.template} <span class="badge">Preview</span></li>
        `,
          )
          .join('')}
      </ul>
      <p style="margin-top: 20px;">
        To integrate with OpenAI Apps SDK, these widgets are also exposed via the MCP Resource API at
        <code>ui://widget/{name}.html</code>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  /**
   * Preview a specific widget
   * GET /widgets/preview/:templateName
   */
  @Get('preview/:templateName')
  async getWidgetPreview(
    @Param('templateName') templateName: string,
    @Query('topping') topping: string,
    @Query('refresh') refresh: string,
    @Res() res: Response,
  ) {
    try {
      let data: any;
      let html: string;

      // Get sample data based on template name
      switch (templateName) {
        case 'pizza-map':
          data = this.widgetService.getSamplePizzaMap();
          html = await this.widgetService.render('pizza-map', data);
          break;
        case 'pizza-carousel':
          data = this.widgetService.getSamplePizzaCarousel();
          html = await this.widgetService.render('pizza-carousel', data);
          break;
        case 'pizza-list':
          // Support topping query parameter for filtering
          const toppingFilter = topping || 'all';
          data = this.widgetService.getSamplePizzaListByTopping(toppingFilter);
          html = await this.widgetService.render('pizza-list', data);
          break;
        case 'pizza-albums':
          data = this.widgetService.getSamplePizzaAlbums();
          html = await this.widgetService.render('pizza-albums', data);
          break;
        default:
          return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Widget Not Found</title></head>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
              <h1>Widget not found</h1>
              <p>Template "${templateName}" does not exist.</p>
              <a href="/widgets/preview">← Back to Gallery</a>
            </body>
            </html>
          `);
      }

      // Wrap the widget in a preview frame
      const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateName} - Widget Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f3f4f6;
      min-height: 100vh;
      padding: 20px;
    }

    .preview-header {
      max-width: 1400px;
      margin: 0 auto 20px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-header h1 {
      font-size: 20px;
      color: #1a1a1a;
    }

    .preview-actions {
      display: flex;
      gap: 12px;
    }

    .preview-button {
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .preview-button:hover {
      background: #2563eb;
    }

    .preview-button.secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .preview-button.secondary:hover {
      background: #f9fafb;
    }

    .widget-frame {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 20px;
      min-height: 400px;
    }
  </style>
</head>
<body>
  <div class="preview-header">
    <h1>📦 ${templateName}</h1>
    <div class="preview-actions">
      <a href="/widgets/preview" class="preview-button secondary">← Gallery</a>
      <button onclick="window.location.reload()" class="preview-button">🔄 Refresh</button>
    </div>
  </div>

  <div class="widget-frame">
    ${html}
  </div>
</body>
</html>
      `.trim();

      res.setHeader('Content-Type', 'text/html');
      res.send(previewHtml);
    } catch (error) {
      console.error('Error rendering widget:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body style="font-family: system-ui; padding: 40px;">
          <h1>Error rendering widget</h1>
          <p>${error.message}</p>
          <a href="/widgets/preview">← Back to Gallery</a>
        </body>
        </html>
      `);
    }
  }
}
