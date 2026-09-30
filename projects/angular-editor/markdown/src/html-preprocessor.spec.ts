import { describe, it, expect } from 'vitest';
import { preprocessHtml } from './html-preprocessor';

describe('preprocessHtml', () => {
  describe('empty/null input', () => {
    it('should return empty string for empty input', () => {
      expect(preprocessHtml('')).toBe('');
    });

    it('should return empty string for bare <br>', () => {
      expect(preprocessHtml('<br>')).toBe('');
    });

    it('should return empty string for whitespace-only', () => {
      expect(preprocessHtml('   ')).toBe('');
    });
  });

  describe('nbsp normalization', () => {
    it('should replace &nbsp; with regular space', () => {
      expect(preprocessHtml('<p>hello&nbsp;world</p>')).toBe('<p>hello world</p>');
    });

    it('should handle multiple &nbsp;', () => {
      expect(preprocessHtml('a&nbsp;&nbsp;b')).toBe('a  b');
    });
  });

  describe('zero-width character removal', () => {
    it('should remove zero-width spaces', () => {
      expect(preprocessHtml('hello\u200Bworld')).toBe('helloworld');
    });

    it('should remove BOM characters', () => {
      expect(preprocessHtml('\uFEFFhello')).toBe('hello');
    });
  });

  describe('br normalization', () => {
    it('should normalize <br/> to <br>', () => {
      expect(preprocessHtml('a<br/>b')).toBe('a<br>b');
    });

    it('should normalize <br /> to <br>', () => {
      expect(preprocessHtml('a<br />b')).toBe('a<br>b');
    });

    it('should normalize <BR> to <br>', () => {
      expect(preprocessHtml('a<BR>b')).toBe('a<br>b');
    });
  });

  describe('empty span removal', () => {
    it('should remove empty spans', () => {
      expect(preprocessHtml('<p>text<span></span>more</p>')).toBe('<p>textmore</p>');
    });

    it('should remove spans with only whitespace', () => {
      expect(preprocessHtml('<p>text<span>  </span>more</p>')).toBe('<p>textmore</p>');
    });

    it('should remove spans with attributes but no content', () => {
      expect(preprocessHtml('<p><span class="x"></span>text</p>')).toBe('<p>text</p>');
    });
  });

  describe('font tag removal', () => {
    it('should strip font tags keeping content', () => {
      expect(preprocessHtml('<font face="Arial">text</font>')).toBe('text');
    });

    it('should handle nested font tags', () => {
      expect(preprocessHtml('<font size="5"><font face="Arial">text</font></font>')).toBe('text');
    });
  });

  describe('br collapse', () => {
    it('should collapse 3+ consecutive br to double', () => {
      expect(preprocessHtml('a<br><br><br><br>b')).toBe('a<br><br>b');
    });

    it('should keep double br as-is', () => {
      expect(preprocessHtml('a<br><br>b')).toBe('a<br><br>b');
    });
  });

  describe('trimming', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(preprocessHtml('  <p>text</p>  ')).toBe('<p>text</p>');
    });
  });
});
