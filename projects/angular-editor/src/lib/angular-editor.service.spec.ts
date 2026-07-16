import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AngularEditorService } from './angular-editor.service';
import { CustomClass } from './config';

// jsdom does not implement document.execCommand — define it globally so tests can spy on it
function mockExecCommand(returnValue = true): ReturnType<typeof vi.fn> {
  const mock = vi.fn().mockReturnValue(returnValue);
  Object.defineProperty(document, 'execCommand', {
    value: mock,
    writable: true,
    configurable: true,
  });
  return mock;
}

function clearExecCommand(): void {
  Object.defineProperty(document, 'execCommand', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

describe('AngularEditorService', () => {
  let service: AngularEditorService;
  let testContainer: HTMLDivElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AngularEditorService,
      ]
    });
    service = TestBed.inject(AngularEditorService);

    // Create a test container for DOM manipulation tests
    testContainer = document.createElement('div');
    testContainer.id = 'test-editor';
    testContainer.contentEditable = 'true';
    document.body.appendChild(testContainer);

    mockExecCommand();
  });

  afterEach(() => {
    // Clean up test container
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
    clearExecCommand();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // Creation
  // ==========================================================================

  describe('creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty savedSelection by default', () => {
      expect(service.savedSelection).toBeNull();
    });

    it('should have empty selectedText by default', () => {
      expect(service.selectedText).toBe('');
    });

    it('should have empty uploadUrl by default', () => {
      expect(service.uploadUrl).toBe('');
    });

    it('should have uploadWithCredentials false by default', () => {
      expect(service.uploadWithCredentials).toBe(false);
    });
  });

  // ==========================================================================
  // executeCommand
  // ==========================================================================

  describe('executeCommand', () => {
    it('should call execCommand with formatBlock for h1', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('h1');
      expect(execMock).toHaveBeenCalledWith('formatBlock', false, 'h1');
    });

    it('should call execCommand with formatBlock for h2', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('h2');
      expect(execMock).toHaveBeenCalledWith('formatBlock', false, 'h2');
    });

    it('should call execCommand with formatBlock for p', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('p');
      expect(execMock).toHaveBeenCalledWith('formatBlock', false, 'p');
    });

    it('should call execCommand with formatBlock for pre', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('pre');
      expect(execMock).toHaveBeenCalledWith('formatBlock', false, 'pre');
    });

    it('should call execCommand directly for bold', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('bold');
      expect(execMock).toHaveBeenCalledWith('bold', false, undefined);
    });

    it('should call execCommand directly for italic', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('italic');
      expect(execMock).toHaveBeenCalledWith('italic', false, undefined);
    });

    it('should pass value to execCommand for commands with value', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.executeCommand('foreColor', '#ff0000');
      expect(execMock).toHaveBeenCalledWith('foreColor', false, '#ff0000');
    });

    it('should call execCommand with formatBlock for all heading levels h1-h6', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(heading => {
        service.executeCommand(heading);
        expect(execMock).toHaveBeenCalledWith('formatBlock', false, heading);
      });
    });
  });

  // ==========================================================================
  // createLink
  // ==========================================================================

  describe('createLink', () => {
    it('should use createlink command for non-http URLs', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.createLink('/relative/path');
      expect(execMock).toHaveBeenCalledWith('createlink', false, '/relative/path');
    });

    it('should use createlink command for relative anchors', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.createLink('#section1');
      expect(execMock).toHaveBeenCalledWith('createlink', false, '#section1');
    });

    it('should use insertHTML for http URLs to open in new tab', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.selectedText = 'Click here';
      service.createLink('http://example.com');

      expect(execMock).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('href="http://example.com"'));
      expect(execMock).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('target="_blank"'));
    });

    it('should use insertHTML for https URLs', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.selectedText = 'Link text';
      service.createLink('https://angular.io');

      expect(execMock).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('href="https://angular.io"'));
    });

    it('should include selectedText in generated anchor HTML', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.selectedText = 'My Link';
      service.createLink('https://example.com');

      const callArg = execMock.mock.calls[0][2] as string;
      expect(callArg).toContain('My Link');
    });
  });

  // ==========================================================================
  // insertHtml
  // ==========================================================================

  describe('insertHtml', () => {
    it('should call execCommand insertHTML with the provided html', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertHtml('<b>bold text</b>');
      expect(execMock).toHaveBeenCalledWith('insertHTML', false, '<b>bold text</b>');
    });

    it('should throw when execCommand returns false', () => {
      const execMock = vi.fn().mockReturnValue(false);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      expect(() => service.insertHtml('<b>test</b>')).toThrow('Unable to perform the operation');
    });
  });

  // ==========================================================================
  // setFontName / setFontSize
  // ==========================================================================

  describe('setFontName', () => {
    it('should call execCommand fontName with the given font', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.setFontName('Arial');
      expect(execMock).toHaveBeenCalledWith('fontName', false, 'Arial');
    });
  });

  describe('setFontSize', () => {
    it('should call execCommand fontSize with the given size', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.setFontSize('3');
      expect(execMock).toHaveBeenCalledWith('fontSize', false, '3');
    });
  });

  describe('setDefaultParagraphSeparator', () => {
    it('should call execCommand defaultParagraphSeparator', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.setDefaultParagraphSeparator('div');
      expect(execMock).toHaveBeenCalledWith('defaultParagraphSeparator', false, 'div');
    });
  });

  // ==========================================================================
  // insertImage
  // ==========================================================================

  describe('insertImage', () => {
    it('should call execCommand insertImage with the given URL', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertImage('https://example.com/image.png');
      expect(execMock).toHaveBeenCalledWith('insertImage', false, 'https://example.com/image.png');
    });
  });

  // ==========================================================================
  // insertColor
  // ==========================================================================

  describe('insertColor', () => {
    it('should call foreColor when where is textColor', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      // Need a saved selection to restore
      const range = document.createRange();
      service.savedSelection = range;

      service.insertColor('#ff0000', 'textColor');
      expect(execMock).toHaveBeenCalledWith('foreColor', false, '#ff0000');
    });

    it('should call hiliteColor when where is backgroundColor', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      const range = document.createRange();
      service.savedSelection = range;

      service.insertColor('#0000ff', 'backgroundColor');
      expect(execMock).toHaveBeenCalledWith('hiliteColor', false, '#0000ff');
    });

    it('should not call execCommand when no selection is saved', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.savedSelection = null;
      service.insertColor('#ff0000', 'textColor');
      expect(execMock).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // saveSelection / restoreSelection
  // ==========================================================================

  describe('saveSelection', () => {
    it('should save the current selection range', () => {
      testContainer.innerHTML = '<p>Test text selection</p>';
      const textNode = testContainer.querySelector('p')!.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 4);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.saveSelection();
      expect(service.savedSelection).toBeTruthy();
    });

    it('should save selectedText from the selection', () => {
      testContainer.innerHTML = '<p>Hello World</p>';
      const textNode = testContainer.querySelector('p')!.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 5);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.saveSelection();
      expect(service.selectedText).toBe('Hello');
    });
  });

  describe('restoreSelection', () => {
    it('should return false when no selection is saved', () => {
      service.savedSelection = null;
      expect(service.restoreSelection()).toBe(false);
    });

    it('should return true when a selection is saved and restored', () => {
      testContainer.innerHTML = '<p>Test</p>';
      const range = document.createRange();
      range.selectNodeContents(testContainer);
      service.savedSelection = range;

      const result = service.restoreSelection();
      expect(result).toBe(true);
    });
  });

  // ==========================================================================
  // insertVideo
  // ==========================================================================

  describe('insertVideo', () => {
    it('should handle YouTube standard URL format (watch?v=)', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      expect(execMock).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('dQw4w9WgXcQ'));
    });

    it('should handle YouTube short URL format (youtu.be)', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://youtu.be/dQw4w9WgXcQ');

      expect(execMock).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('dQw4w9WgXcQ'));
    });

    it('should generate youtube thumbnail image URL for standard YouTube links', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://www.youtube.com/watch?v=TEST123');

      const callArg = execMock.mock.calls[0][2] as string;
      expect(callArg).toContain('img.youtube.com/vi/TEST123/0.jpg');
    });

    it('should generate youtube thumbnail image URL for youtu.be links', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://youtu.be/SHORTID');

      const callArg = execMock.mock.calls[0][2] as string;
      expect(callArg).toContain('img.youtube.com/vi/SHORTID/0.jpg');
    });

    it('should extract YouTube ID from URL with extra parameters', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://www.youtube.com/watch?v=VIDEOID&t=60&list=PL123');

      const callArg = execMock.mock.calls[0][2] as string;
      expect(callArg).toContain('img.youtube.com/vi/VIDEOID/0.jpg');
    });

    it('should not call insertHTML for Vimeo (uses HTTP request)', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      // Vimeo calls HTTP API — just verify it doesn't crash with non-YouTube URL
      service.insertVideo('https://vimeo.com/123456789');
      expect(execMock).not.toHaveBeenCalled();
    });

    it('should not insert video for unrecognized URL', () => {
      const execMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', { value: execMock, writable: true, configurable: true });

      service.insertVideo('https://example.com/video.mp4');
      expect(execMock).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // uploadImage
  // ==========================================================================

  describe('uploadImage', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should POST to the uploadUrl', () => {
      service.uploadUrl = 'https://api.example.com/upload';
      const file = new File(['content'], 'test.png', { type: 'image/png' });

      service.uploadImage(file).subscribe();

      const req = httpMock.expectOne('https://api.example.com/upload');
      expect(req.request.method).toBe('POST');
      req.flush({ imageUrl: 'https://api.example.com/images/test.png' });
    });

    it('should include the file in FormData', () => {
      service.uploadUrl = 'https://api.example.com/upload';
      const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

      service.uploadImage(file).subscribe();

      const req = httpMock.expectOne('https://api.example.com/upload');
      expect(req.request.body).toBeInstanceOf(FormData);
      req.flush({ imageUrl: '' });
    });

    it('should use reportProgress and observe events', () => {
      service.uploadUrl = 'https://api.example.com/upload';
      const file = new File(['content'], 'test.png', { type: 'image/png' });

      service.uploadImage(file).subscribe();

      const req = httpMock.expectOne('https://api.example.com/upload');
      expect(req.request.reportProgress).toBe(true);
      req.flush({ imageUrl: '' });
    });

    it('should use withCredentials from service property', () => {
      service.uploadUrl = 'https://api.example.com/upload';
      service.uploadWithCredentials = true;
      const file = new File(['content'], 'test.png', { type: 'image/png' });

      service.uploadImage(file).subscribe();

      const req = httpMock.expectOne('https://api.example.com/upload');
      expect(req.request.withCredentials).toBe(true);
      req.flush({ imageUrl: '' });
    });
  });

  // ==========================================================================
  // nextNode
  // ==========================================================================

  describe('nextNode', () => {
    it('should return firstChild when node has children', () => {
      testContainer.innerHTML = '<p>Text</p>';
      // testContainer has a <p> as firstChild
      const result = service.nextNode(testContainer);
      expect(result).toBe(testContainer.firstChild);
    });

    it('should return first child when node has children (depth-first traversal)', () => {
      // nextNode does a depth-first walk: if node has children, go into them first
      const div = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      span1.textContent = 'First';
      span2.textContent = 'Second';
      div.appendChild(span1);
      div.appendChild(span2);
      document.body.appendChild(div);

      // span1 has a child text node, so nextNode returns the first child (text node)
      const result = service.nextNode(span1);
      expect(result).toBe(span1.firstChild); // text node "First"

      // For a leaf text node, nextNode returns the next sibling (span2)
      const textResult = service.nextNode(span1.firstChild!);
      expect(textResult).toBe(span2);

      document.body.removeChild(div);
    });

    it('should return null when at the end of the tree (detached node)', () => {
      // A detached div with no children, no next sibling, no parent
      const div = document.createElement('div');
      const result = service.nextNode(div);
      expect(result).toBeNull();
    });

    it('should walk up to parent sibling when node has no next sibling', () => {
      // Structure: outer > inner > leaf
      // leaf has no next sibling, inner has no next sibling, outer has next sibling
      const outer = document.createElement('div');
      const inner = document.createElement('span');
      const leaf = document.createElement('em');
      const sibling = document.createElement('div');

      inner.appendChild(leaf);
      outer.appendChild(inner);
      document.body.appendChild(outer);
      document.body.appendChild(sibling);

      const result = service.nextNode(leaf);
      // Goes up: leaf -> inner (no next sibling) -> outer -> sibling
      expect(result).toBe(sibling);

      document.body.removeChild(outer);
      document.body.removeChild(sibling);
    });
  });

  // ==========================================================================
  // removeSelectedElements
  // ==========================================================================

  describe('removeSelectedElements', () => {
    it('should replace element with its children via replaceWithOwnChildren', () => {
      testContainer.innerHTML = '<p><b>Bold text</b></p>';
      const p = testContainer.querySelector('p')!;
      const b = testContainer.querySelector('b')!;

      // Call replaceWithOwnChildren directly (the implementation detail)
      service.replaceWithOwnChildren(b);

      expect(testContainer.querySelector('b')).toBeNull();
      expect(p.textContent).toContain('Bold text');
    });

    it('replaceWithOwnChildren should move all children before the element', () => {
      testContainer.innerHTML = '<div><span>A</span><span>B</span></div>';
      const div = testContainer.querySelector('div')!;

      service.replaceWithOwnChildren(div);

      expect(testContainer.querySelector('div')).toBeNull();
      expect(testContainer.querySelectorAll('span').length).toBe(2);
    });
  });

  // ==========================================================================
  // createCustomClass
  // ==========================================================================

  describe('createCustomClass', () => {
    it('should not apply class when no selection', () => {
      const customClass: CustomClass = { name: 'Test', class: 'test-class' };
      service.savedSelection = null;

      expect(() => service.createCustomClass(customClass)).not.toThrow();
    });

    it('should not apply class when customClass is null', () => {
      const range = document.createRange();
      service.savedSelection = range;

      expect(() => service.createCustomClass(null as unknown as CustomClass)).not.toThrow();
    });

    it('should apply inline class to single text selection', () => {
      testContainer.innerHTML = '<p>Hello World</p>';
      const textNode = testContainer.querySelector('p')!.firstChild!;

      const range = document.createRange();
      range.setStart(textNode, 6);
      range.setEnd(textNode, 11);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.savedSelection = range;
      service.selectedText = 'World';

      const customClass: CustomClass = { name: 'Test', class: 'highlight', mode: 'inline' };
      service.createCustomClass(customClass);

      const span = testContainer.querySelector('span.highlight');
      expect(span).toBeTruthy();
      expect(span!.textContent).toBe('World');
    });

    it('should apply block class to multiple paragraphs', () => {
      testContainer.innerHTML = '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>';
      const paragraphs = testContainer.querySelectorAll('p');

      const range = document.createRange();
      range.setStart(paragraphs[0].firstChild!, 0);
      range.setEnd(paragraphs[2].firstChild!, paragraphs[2].textContent!.length);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.savedSelection = range;
      service.selectedText = 'First paragraph\nSecond paragraph\nThird paragraph';

      const customClass: CustomClass = { name: 'Test', class: 'block-highlight', mode: 'block' };
      service.createCustomClass(customClass);

      const highlightedParagraphs = testContainer.querySelectorAll('p.block-highlight');
      expect(highlightedParagraphs.length).toBeGreaterThan(0);
    });

    it('should use auto mode by default', () => {
      testContainer.innerHTML = '<p>Single paragraph</p>';
      const p = testContainer.querySelector('p')!;
      const textNode = p.firstChild!;

      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, textNode.textContent!.length);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.savedSelection = range;
      service.selectedText = 'Single paragraph';

      const customClass: CustomClass = { name: 'Test', class: 'auto-class' };
      service.createCustomClass(customClass);

      const result = testContainer.querySelector('.auto-class');
      expect(result).toBeTruthy();
    });

    it('should toggle class when applied twice in block mode', () => {
      testContainer.innerHTML = '<p class="toggle-class">Paragraph with class</p>';
      const p = testContainer.querySelector('p')!;

      const range = document.createRange();
      range.selectNodeContents(p);

      service.savedSelection = range;

      const customClass: CustomClass = { name: 'Test', class: 'toggle-class', mode: 'block' };
      service.createCustomClass(customClass);

      expect(p.classList.contains('toggle-class')).toBe(false);
    });
  });

  // ==========================================================================
  // executeInNextQueueIteration
  // ==========================================================================

  describe('executeInNextQueueIteration', () => {
    it('should call the callback after timeout', async () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      service.executeInNextQueueIteration(callback);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });

    it('should use custom timeout when provided', async () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      service.executeInNextQueueIteration(callback, 500);
      vi.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });
  });
});
