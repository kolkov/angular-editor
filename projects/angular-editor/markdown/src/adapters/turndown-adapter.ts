import TurndownService from 'turndown';
import { HtmlToMarkdownRenderer, MarkdownConversionConfig, DEFAULT_CONVERSION_CONFIG } from '../types';

export class TurndownAdapter implements HtmlToMarkdownRenderer {
  private turndown: TurndownService;

  constructor(config: MarkdownConversionConfig = DEFAULT_CONVERSION_CONFIG) {
    this.turndown = new TurndownService({
      headingStyle: config.headingStyle || 'atx',
      bulletListMarker: config.bulletListMarker || '-',
      codeBlockStyle: config.codeBlockStyle || 'fenced',
      emDelimiter: config.emDelimiter || '*',
      strongDelimiter: config.strongDelimiter || '**',
      linkStyle: config.linkStyle || 'inlined',
    });

    if (config.gfm !== false) {
      this.addGfmRules();
    }

    this.addCleanupRules();
  }

  render(html: string): string {
    return this.turndown.turndown(html);
  }

  private addCleanupRules(): void {
    this.turndown.addRule('preWithoutCode', {
      filter: (node) => {
        return node.nodeName === 'PRE' &&
          !(node.firstChild && node.firstChild.nodeName === 'CODE');
      },
      replacement: (_content, node) => {
        const code = (node as HTMLElement).textContent || '';
        return '\n\n```\n' + code.replace(/\n$/, '') + '\n```\n\n';
      },
    });
  }

  private addGfmRules(): void {
    this.turndown.addRule('strikethrough', {
      filter: ['del', 's'],
      replacement: (content) => `~~${content}~~`,
    });

    this.turndown.addRule('taskListItem', {
      filter: (node) => {
        return node.nodeName === 'LI' &&
          node.firstElementChild?.nodeName === 'INPUT' &&
          (node.firstElementChild as HTMLInputElement).type === 'checkbox';
      },
      replacement: (content, node) => {
        const checkbox = (node as HTMLElement).firstElementChild as HTMLInputElement;
        const checked = checkbox.checked ? 'x' : ' ';
        const text = content.replace(/^\s*\[[ x]\]\s*/, '').trim();
        return `- [${checked}] ${text}\n`;
      },
    });
  }
}
