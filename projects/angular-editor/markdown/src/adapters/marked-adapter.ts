import { marked } from 'marked';
import { MarkdownToHtmlRenderer, MarkdownConversionConfig, DEFAULT_CONVERSION_CONFIG } from '../types';

export class MarkedAdapter implements MarkdownToHtmlRenderer {
  constructor(config: MarkdownConversionConfig = DEFAULT_CONVERSION_CONFIG) {
    marked.setOptions({
      gfm: config.gfm !== false,
      breaks: true,
    });
  }

  render(markdown: string): string {
    const result = marked.parse(markdown, { async: false });
    return (typeof result === 'string' ? result : '').trim();
  }
}
