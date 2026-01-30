import {inject, TestBed} from '@angular/core/testing';

import {AngularEditorService} from './angular-editor.service';
import {HttpClientModule} from '@angular/common/http';
import {CustomClass} from './config';

describe('AngularEditorService', () => {
  let service: AngularEditorService;
  let testContainer: HTMLDivElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [AngularEditorService]
    });
    service = TestBed.inject(AngularEditorService);

    // Create a test container for DOM manipulation tests
    testContainer = document.createElement('div');
    testContainer.id = 'test-editor';
    testContainer.contentEditable = 'true';
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Clean up test container
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
  });

  it('should be created', inject([AngularEditorService], (svc: AngularEditorService) => {
    expect(svc).toBeTruthy();
  }));

  describe('createCustomClass', () => {
    it('should not apply class when no selection', () => {
      const customClass: CustomClass = { name: 'Test', class: 'test-class' };
      service.savedSelection = null;

      // Should not throw
      expect(() => service.createCustomClass(customClass)).not.toThrow();
    });

    it('should not apply class when customClass is null', () => {
      const range = document.createRange();
      service.savedSelection = range;

      expect(() => service.createCustomClass(null as any)).not.toThrow();
    });

    it('should apply inline class to single text selection', () => {
      // Setup: single text node
      testContainer.innerHTML = '<p>Hello World</p>';
      const textNode = testContainer.querySelector('p')!.firstChild!;

      // Create selection range for "World"
      const range = document.createRange();
      range.setStart(textNode, 6);
      range.setEnd(textNode, 11);

      // Set selection
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.savedSelection = range;
      service.selectedText = 'World';

      const customClass: CustomClass = { name: 'Test', class: 'highlight', mode: 'inline' };
      service.createCustomClass(customClass);

      // Verify span was created with class
      const span = testContainer.querySelector('span.highlight');
      expect(span).toBeTruthy();
      expect(span!.textContent).toBe('World');
    });

    it('should apply block class to multiple paragraphs', () => {
      // Setup: multiple paragraphs
      testContainer.innerHTML = '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>';
      const paragraphs = testContainer.querySelectorAll('p');

      // Create selection range spanning all paragraphs
      const range = document.createRange();
      range.setStart(paragraphs[0].firstChild!, 0);
      range.setEnd(paragraphs[2].firstChild!, paragraphs[2].textContent!.length);

      // Set selection
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.savedSelection = range;
      service.selectedText = 'First paragraph\nSecond paragraph\nThird paragraph';

      const customClass: CustomClass = { name: 'Test', class: 'block-highlight', mode: 'block' };
      service.createCustomClass(customClass);

      // Verify class was applied to paragraphs
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

      // No mode specified - should default to 'auto'
      const customClass: CustomClass = { name: 'Test', class: 'auto-class' };
      service.createCustomClass(customClass);

      // For single block, auto mode should use inline wrapping
      const result = testContainer.querySelector('.auto-class');
      expect(result).toBeTruthy();
    });

    it('should toggle class when applied twice in block mode', () => {
      testContainer.innerHTML = '<p class="toggle-class">Paragraph with class</p>';
      const p = testContainer.querySelector('p')!;
      const textNode = p.firstChild!;

      const range = document.createRange();
      range.selectNodeContents(p);

      service.savedSelection = range;

      const customClass: CustomClass = { name: 'Test', class: 'toggle-class', mode: 'block' };
      service.createCustomClass(customClass);

      // Class should be removed (toggled off)
      expect(p.classList.contains('toggle-class')).toBeFalse();
    });
  });
});
