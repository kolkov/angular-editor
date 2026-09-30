import { describe, it, expect } from 'vitest';
import { TurndownAdapter } from './turndown-adapter';

describe('TurndownAdapter', () => {
  const adapter = new TurndownAdapter();

  describe('basic conversions', () => {
    it('should convert heading', () => {
      const md = adapter.render('<h1>Hello</h1>');
      expect(md).toContain('Hello');
    });

    it('should convert bold', () => {
      expect(adapter.render('<strong>bold</strong>')).toBe('**bold**');
    });

    it('should convert italic', () => {
      expect(adapter.render('<em>italic</em>')).toBe('*italic*');
    });

    it('should convert link', () => {
      expect(adapter.render('<a href="https://example.com">link</a>')).toBe('[link](https://example.com)');
    });

    it('should convert unordered list', () => {
      const html = '<ul><li>one</li><li>two</li></ul>';
      const md = adapter.render(html);
      expect(md).toContain('one');
      expect(md).toContain('two');
    });
  });

  describe('code blocks', () => {
    it('should convert pre > code to fenced code block', () => {
      const html = '<pre><code>const x = 1;</code></pre>';
      const md = adapter.render(html);
      expect(md).toContain('```');
      expect(md).toContain('const x = 1;');
    });

    it('should convert pre without code (IDE paste) to code block', () => {
      const html = '<pre><span style="color:#cf8e6d">function</span> hello()</pre>';
      const md = adapter.render(html);
      expect(md).toContain('```');
      expect(md).toContain('function hello()');
    });

    it('should handle pre with styled spans (JetBrains paste)', () => {
      const html = '<div style="background:#1e1f22"><pre style="font-family:monospace"><span style="color:#cf8e6d">const</span> x = 1;</pre></div>';
      const md = adapter.render(html);
      expect(md).toContain('const x = 1');
      expect(md).not.toContain('style=');
    });
  });

  describe('GFM strikethrough', () => {
    it('should convert del to strikethrough', () => {
      expect(adapter.render('<del>deleted</del>')).toBe('~~deleted~~');
    });

    it('should convert s to strikethrough', () => {
      expect(adapter.render('<s>deleted</s>')).toBe('~~deleted~~');
    });
  });

  describe('styled elements cleanup', () => {
    it('should strip styled div wrappers', () => {
      const html = '<div style="background:red"><p>text</p></div>';
      const md = adapter.render(html);
      expect(md).toContain('text');
      expect(md).not.toContain('style');
    });

    it('should strip styled spans keeping content', () => {
      const html = '<p><span style="color:red">colored</span> text</p>';
      const md = adapter.render(html);
      expect(md).toContain('colored text');
      expect(md).not.toContain('style');
    });
  });
});
