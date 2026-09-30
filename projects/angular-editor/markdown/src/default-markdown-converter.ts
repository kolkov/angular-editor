import {
  MarkdownConverter,
  MarkdownConversionConfig,
  HtmlToMarkdownRenderer,
  MarkdownToHtmlRenderer,
  DEFAULT_CONVERSION_CONFIG,
} from './types';
import { preprocessHtml } from './html-preprocessor';
import { postprocessMarkdown } from './markdown-postprocessor';

export class DefaultMarkdownConverter implements MarkdownConverter {
  constructor(
    private htmlToMd: HtmlToMarkdownRenderer,
    private mdToHtml: MarkdownToHtmlRenderer,
    private config: MarkdownConversionConfig = DEFAULT_CONVERSION_CONFIG,
  ) {}

  toMarkdown(html: string): string {
    const preprocessed = preprocessHtml(html);
    if (!preprocessed) {
      return '';
    }
    const raw = this.htmlToMd.render(preprocessed);
    return postprocessMarkdown(raw);
  }

  toHtml(markdown: string): string {
    if (!markdown || markdown.trim() === '') {
      return '';
    }
    return this.mdToHtml.render(markdown);
  }
}
