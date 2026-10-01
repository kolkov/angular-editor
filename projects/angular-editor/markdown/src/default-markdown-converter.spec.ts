import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DefaultMarkdownConverter } from './default-markdown-converter';
import { HtmlToMarkdownRenderer, MarkdownToHtmlRenderer } from './types';

describe('DefaultMarkdownConverter', () => {
  let mockHtmlToMd: HtmlToMarkdownRenderer;
  let mockMdToHtml: MarkdownToHtmlRenderer;
  let converter: DefaultMarkdownConverter;

  beforeEach(() => {
    mockHtmlToMd = { render: vi.fn((html: string) => `MD:${html}`) };
    mockMdToHtml = { render: vi.fn((md: string) => `HTML:${md}`) };
    converter = new DefaultMarkdownConverter(mockHtmlToMd, mockMdToHtml);
  });

  // ==========================================================================
  // toMarkdown
  // ==========================================================================

  describe('toMarkdown', () => {
    it('should call htmlToMd renderer with preprocessed HTML', () => {
      converter.toMarkdown('<p>hello</p>');
      expect(mockHtmlToMd.render).toHaveBeenCalledWith('<p>hello</p>');
    });

    it('should preprocess HTML before passing to renderer', () => {
      converter.toMarkdown('<p>hello&nbsp;world</p>');
      expect(mockHtmlToMd.render).toHaveBeenCalledWith('<p>hello world</p>');
    });

    it('should postprocess markdown output', () => {
      const result = converter.toMarkdown('<p>hello</p>');
      expect(result).toMatch(/\n$/);
    });

    it('should return empty string for empty input', () => {
      expect(converter.toMarkdown('')).toBe('');
      expect(mockHtmlToMd.render).not.toHaveBeenCalled();
    });

    it('should return empty string for bare <br>', () => {
      expect(converter.toMarkdown('<br>')).toBe('');
      expect(mockHtmlToMd.render).not.toHaveBeenCalled();
    });

    it('should strip font tags before conversion', () => {
      converter.toMarkdown('<font face="Arial">text</font>');
      expect(mockHtmlToMd.render).toHaveBeenCalledWith('text');
    });

    it('should normalize &nbsp; before conversion', () => {
      converter.toMarkdown('a&nbsp;b');
      expect(mockHtmlToMd.render).toHaveBeenCalledWith('a b');
    });

    it('should handle pipeline: preprocess → render → postprocess', () => {
      (mockHtmlToMd.render as ReturnType<typeof vi.fn>).mockReturnValue('# hello   \n\n\n\nworld');
      const result = converter.toMarkdown('<h1>hello</h1><p>world</p>');
      expect(result).toBe('# hello\n\nworld\n');
    });
  });

  // ==========================================================================
  // toHtml
  // ==========================================================================

  describe('toHtml', () => {
    it('should call mdToHtml renderer', () => {
      converter.toHtml('# Hello');
      expect(mockMdToHtml.render).toHaveBeenCalledWith('# Hello');
    });

    it('should return renderer output', () => {
      (mockMdToHtml.render as ReturnType<typeof vi.fn>).mockReturnValue('<h1>Hello</h1>');
      expect(converter.toHtml('# Hello')).toBe('<h1>Hello</h1>');
    });

    it('should return empty string for empty input', () => {
      expect(converter.toHtml('')).toBe('');
      expect(mockMdToHtml.render).not.toHaveBeenCalled();
    });

    it('should return empty string for whitespace-only input', () => {
      expect(converter.toHtml('   ')).toBe('');
      expect(mockMdToHtml.render).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Full pipeline isolation
  // ==========================================================================

  describe('pipeline isolation', () => {
    it('should not pass infrastructure concerns to renderers', () => {
      converter.toMarkdown('<font face="Arial"><span></span>text&nbsp;here</font>');
      expect(mockHtmlToMd.render).toHaveBeenCalledWith('text here');
    });

    it('renderers are injectable — converter does not depend on specific library', () => {
      const customHtmlToMd: HtmlToMarkdownRenderer = {
        render: (html) => html.toUpperCase(),
      };
      const customMdToHtml: MarkdownToHtmlRenderer = {
        render: (md) => `<div>${md}</div>`,
      };
      const custom = new DefaultMarkdownConverter(customHtmlToMd, customMdToHtml);
      expect(custom.toMarkdown('<p>hello</p>')).toBe('<P>HELLO</P>\n');
      expect(custom.toHtml('hello')).toBe('<div>hello</div>');
    });
  });
});
