export interface HtmlToMarkdownRenderer {
  render(html: string): string;
}

export interface MarkdownToHtmlRenderer {
  render(markdown: string): string;
}

export interface MarkdownConversionConfig {
  gfm?: boolean;
  headingStyle?: 'atx' | 'setext';
  bulletListMarker?: '-' | '*' | '+';
  codeBlockStyle?: 'fenced' | 'indented';
  emDelimiter?: '*' | '_';
  strongDelimiter?: '**' | '__';
  linkStyle?: 'inlined' | 'referenced';
}

export const DEFAULT_CONVERSION_CONFIG: MarkdownConversionConfig = {
  gfm: true,
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
};

export interface MarkdownConverter {
  toMarkdown(html: string): string;
  toHtml(markdown: string): string;
}
