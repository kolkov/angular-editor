import { describe, it, expect } from 'vitest';
import { postprocessMarkdown } from './markdown-postprocessor';

describe('postprocessMarkdown', () => {
  describe('empty input', () => {
    it('should return empty string for empty input', () => {
      expect(postprocessMarkdown('')).toBe('');
    });

    it('should return empty string for whitespace-only', () => {
      expect(postprocessMarkdown('   \n  \n  ')).toBe('');
    });
  });

  describe('trailing whitespace', () => {
    it('should trim trailing whitespace from each line', () => {
      expect(postprocessMarkdown('hello   \nworld  ')).toBe('hello\nworld\n');
    });

    it('should trim trailing tabs', () => {
      expect(postprocessMarkdown('hello\t\nworld')).toBe('hello\nworld\n');
    });
  });

  describe('line endings', () => {
    it('should normalize CRLF to LF', () => {
      expect(postprocessMarkdown('hello\r\nworld')).toBe('hello\nworld\n');
    });
  });

  describe('blank line collapse', () => {
    it('should collapse 3+ blank lines to 2', () => {
      expect(postprocessMarkdown('a\n\n\n\nb')).toBe('a\n\nb\n');
    });

    it('should keep double blank line as-is', () => {
      expect(postprocessMarkdown('a\n\nb')).toBe('a\n\nb\n');
    });
  });

  describe('trailing newline', () => {
    it('should ensure single trailing newline', () => {
      expect(postprocessMarkdown('hello')).toBe('hello\n');
    });

    it('should not add extra newlines if already has one', () => {
      expect(postprocessMarkdown('hello\n')).toBe('hello\n');
    });

    it('should collapse multiple trailing newlines', () => {
      expect(postprocessMarkdown('hello\n\n\n')).toBe('hello\n');
    });
  });
});
