import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AngularEditorComponent } from './angular-editor.component';
import { AngularEditorModule } from '../angular-editor.module';
import { angularEditorConfig } from '../config';

// jsdom does not implement execCommand / queryCommandState / queryCommandValue
function mockDocumentCommands(): void {
  Object.defineProperty(document, 'execCommand', {
    value: vi.fn().mockReturnValue(true),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(document, 'queryCommandState', {
    value: vi.fn().mockReturnValue(false),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(document, 'queryCommandValue', {
    value: vi.fn().mockReturnValue(''),
    writable: true,
    configurable: true,
  });
}

describe('AngularEditorComponent', () => {
  let component: AngularEditorComponent;
  let fixture: ComponentFixture<AngularEditorComponent>;

  beforeEach(async () => {
    mockDocumentCommands();

    await TestBed.configureTestingModule({
      imports: [FormsModule, AngularEditorModule],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // Creation
  // ==========================================================================

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start in visual mode', () => {
      expect(component.modeVisual).toBe(true);
    });

    it('should not be disabled by default', () => {
      expect(component.disabled).toBe(false);
    });

    it('should not be focused by default', () => {
      expect(component.focused).toBe(false);
    });

    it('should not show placeholder by default', () => {
      expect(component.showPlaceholder).toBe(false);
    });

    it('should use default config', () => {
      expect(component.config.toolbarPosition).toBe(angularEditorConfig.toolbarPosition);
    });
  });

  // ==========================================================================
  // ControlValueAccessor
  // ==========================================================================

  describe('ControlValueAccessor', () => {
    it('should register onChange callback', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      // Trigger content change to verify the callback is registered
      component.onContentChange(component.textArea.nativeElement);
      expect(fn).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      // Trigger blur to verify callback is registered
      const event = new FocusEvent('blur', { relatedTarget: null });
      component.onTextAreaBlur(event);
      expect(fn).toHaveBeenCalled();
    });

    it('should call onChange with empty string when content is br', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.textArea.nativeElement.innerHTML = '<br>';
      component.onContentChange(component.textArea.nativeElement);
      expect(fn).toHaveBeenCalledWith('');
    });

    it('should call onChange with sanitized html when content has text', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.textArea.nativeElement.innerHTML = '<p>Hello</p>';
      component.onContentChange(component.textArea.nativeElement);
      expect(fn).toHaveBeenCalled();
    });

    it('writeValue should set innerHTML of the textarea', () => {
      component.writeValue('<p>Test content</p>');
      expect(component.textArea.nativeElement.innerHTML).toBe('<p>Test content</p>');
    });

    it('writeValue with empty string should clear the textarea', () => {
      component.textArea.nativeElement.innerHTML = '<p>Old content</p>';
      component.writeValue('');
      expect(component.textArea.nativeElement.innerHTML).toBe('');
    });

    it('writeValue with null should clear the textarea', () => {
      component.textArea.nativeElement.innerHTML = '<p>Old content</p>';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.writeValue(null as any);
      expect(component.textArea.nativeElement.innerHTML).toBe('');
    });

    it('writeValue with undefined should clear the textarea', () => {
      component.textArea.nativeElement.innerHTML = '<p>Old content</p>';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.writeValue(undefined as any);
      expect(component.textArea.nativeElement.innerHTML).toBe('');
    });

    it('setDisabledState should add disabled class when true', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      expect(component.textArea.nativeElement.classList.contains('disabled')).toBe(true);
    });

    it('setDisabledState should remove disabled class when false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
      expect(component.textArea.nativeElement.classList.contains('disabled')).toBe(false);
    });
  });

  // ==========================================================================
  // Placeholder
  // ==========================================================================

  describe('placeholder', () => {
    it('should toggle placeholder by adding show-placeholder class', () => {
      component.togglePlaceholder(false);
      expect(component.editorWrapper.nativeElement.classList.contains('show-placeholder')).toBe(true);
      expect(component.showPlaceholder).toBe(true);
    });

    it('should remove show-placeholder class when toggled true', () => {
      component.togglePlaceholder(false);
      component.togglePlaceholder(true);
      expect(component.editorWrapper.nativeElement.classList.contains('show-placeholder')).toBe(false);
      expect(component.showPlaceholder).toBe(false);
    });

    it('should show placeholder on writeValue with empty string', () => {
      component.writeValue('some content');
      component.writeValue('');
      expect(component.showPlaceholder).toBe(true);
    });
  });

  // ==========================================================================
  // onPaste
  // ==========================================================================

  describe('onPaste', () => {
    it('should paste raw text when rawPaste is true', () => {
      const rawText = 'Hello!';
      component.config.rawPaste = true;

      const mockEvent = {
        type: 'paste',
        preventDefault: vi.fn(),
        clipboardData: {
          getData: (type: string) => type === 'text/plain' ? rawText : '<h1>Hello!</h1>',
        },
      } as unknown as ClipboardEvent;

      const outputRawText = component.onPaste(mockEvent);

      expect(outputRawText).toEqual(rawText);
      const execMock = document.execCommand as ReturnType<typeof vi.fn>;
      expect(execMock).toHaveBeenCalledWith('insertHTML', false, rawText);
    });

    it('should return undefined when rawPaste is false', () => {
      component.config.rawPaste = false;

      const mockEvent = {
        type: 'paste',
        preventDefault: vi.fn(),
        clipboardData: {
          getData: () => '',
        },
      } as unknown as ClipboardEvent;

      const result = component.onPaste(mockEvent);
      expect(result).toBeUndefined();
    });

    it('should call preventDefault when rawPaste is true', () => {
      component.config.rawPaste = true;
      const preventDefaultSpy = vi.fn();

      const mockEvent = {
        type: 'paste',
        preventDefault: preventDefaultSpy,
        clipboardData: {
          getData: () => 'text',
        },
      } as unknown as ClipboardEvent;

      component.onPaste(mockEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // getFonts
  // ==========================================================================

  describe('getFonts', () => {
    it('should return fonts from config', () => {
      // Use isolated config to avoid mutating the shared angularEditorConfig singleton
      component.config = { ...angularEditorConfig, fonts: [
        { name: 'Arial', class: 'arial' },
        { name: 'Calibri', class: 'calibri' },
      ]};
      const fonts = component.getFonts();
      expect(fonts.length).toBe(2);
      expect(fonts[0]).toEqual({ label: 'Arial', value: 'Arial' });
    });

    it('should return default fonts when config has none', () => {
      // Use isolated config so angularEditorConfig.fonts is not mutated
      component.config = { ...angularEditorConfig, fonts: undefined };
      const fonts = component.getFonts();
      // angularEditorConfig.fonts has 4 default fonts, so fallback returns > 0
      expect(fonts.length).toBeGreaterThan(0);
    });

    it('should map font names to label/value pairs', () => {
      component.config = { ...angularEditorConfig, fonts: [{ name: 'Times New Roman', class: 'times' }] };
      const fonts = component.getFonts();
      expect(fonts[0].label).toBe('Times New Roman');
      expect(fonts[0].value).toBe('Times New Roman');
    });
  });

  // ==========================================================================
  // getCustomTags
  // ==========================================================================

  describe('getCustomTags', () => {
    it('should always include span', () => {
      component.config.customClasses = [];
      const tags = component.getCustomTags();
      expect(tags).toContain('span');
    });

    it('should include custom tags from customClasses', () => {
      component.config.customClasses = [
        { name: 'Block', class: 'my-block', tag: 'div' },
        { name: 'Quote', class: 'my-quote', tag: 'blockquote' },
      ];
      const tags = component.getCustomTags();
      expect(tags).toContain('div');
      expect(tags).toContain('blockquote');
    });

    it('should not duplicate tags', () => {
      component.config.customClasses = [
        { name: 'A', class: 'class-a', tag: 'div' },
        { name: 'B', class: 'class-b', tag: 'div' },
      ];
      const tags = component.getCustomTags();
      const divOccurrences = tags.split(',').filter(t => t === 'div').length;
      expect(divOccurrences).toBe(1);
    });

    it('should return comma-separated tag string', () => {
      component.config.customClasses = [{ name: 'H', class: 'heading', tag: 'h1' }];
      const tags = component.getCustomTags();
      expect(tags).toMatch(/span.*h1|h1.*span/);
    });
  });

  // ==========================================================================
  // filterStyles
  // ==========================================================================

  describe('filterStyles', () => {
    it('should remove position fixed style', () => {
      const result = component.filterStyles('color: red; position: fixed; font-size: 12px;');
      expect(result).not.toContain('position: fixed;');
    });

    it('should not modify html without position fixed', () => {
      const html = '<p style="color: red;">Text</p>';
      const result = component.filterStyles(html);
      expect(result).toBe(html);
    });
  });

  // ==========================================================================
  // Sanitization
  // ==========================================================================

  describe('sanitization', () => {
    it('should strip script tags when sanitize is true', () => {
      component.config.sanitize = true;
      component.writeValue('<script>alert("xss")</script><p>Safe</p>');
      expect(component.textArea.nativeElement.innerHTML).not.toContain('<script>');
    });

    it('should preserve html when sanitize is false', () => {
      component.config.sanitize = false;
      component.writeValue('<p>Safe content</p>');
      expect(component.textArea.nativeElement.innerHTML).toContain('<p>Safe content</p>');
    });
  });

  // ==========================================================================
  // Focus and blur
  // ==========================================================================

  describe('focus and blur', () => {
    it('should set focused to true on text area focus event', () => {
      component.focused = false;
      const event = new FocusEvent('focus');
      component.onTextAreaFocus(event);
      expect(component.focused).toBe(true);
    });

    it('should emit focusEvent on text area focus', () => {
      const emitSpy = vi.spyOn(component.focusEvent, 'emit');
      const event = new FocusEvent('focus');
      component.onTextAreaFocus(event);
      expect(emitSpy).toHaveBeenCalledWith(event);
    });

    it('should not emit focusEvent again when already focused', () => {
      component.focused = true;
      const emitSpy = vi.spyOn(component.focusEvent, 'emit');
      const event = new FocusEvent('focus');
      component.onTextAreaFocus(event);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should call onTouched on blur', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      const event = new FocusEvent('blur', { relatedTarget: null });
      component.onTextAreaBlur(event);
      expect(fn).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // textDirection (RTL/LTR)
  // ==========================================================================

  describe('textDirection', () => {
    it('should set dir attribute to rtl when textDirection is rtl', () => {
      component.config.textDirection = 'rtl';
      fixture.detectChanges();
      const textarea = component.textArea.nativeElement;
      expect(textarea.getAttribute('dir')).toBe('rtl');
    });

    it('should set dir attribute to ltr when textDirection is ltr', () => {
      component.config.textDirection = 'ltr';
      fixture.detectChanges();
      const textarea = component.textArea.nativeElement;
      expect(textarea.getAttribute('dir')).toBe('ltr');
    });
  });

  // ==========================================================================
  // Config: editable
  // ==========================================================================

  describe('editable config', () => {
    it('should set contenteditable attribute from config', () => {
      component.config.editable = true;
      fixture.detectChanges();
      expect(component.textArea.nativeElement.getAttribute('contenteditable')).toBe('true');
    });

    it('should set height from config', () => {
      component.config.height = '200px';
      fixture.detectChanges();
      expect(component.textArea.nativeElement.style.height).toBe('200px');
    });

    it('should set minHeight from config', () => {
      component.config.minHeight = '100px';
      fixture.detectChanges();
      expect(component.textArea.nativeElement.style.minHeight).toBe('100px');
    });
  });

  // ==========================================================================
  // Multiple editors - unique IDs
  // ==========================================================================

  describe('multiple editors', () => {
    it('should accept unique id attribute', () => {
      component.id = 'editor-1';
      fixture.detectChanges();
      expect(component.id).toBe('editor-1');
    });

    it('should use different ids for multiple instances', async () => {
      const fixture2 = TestBed.createComponent(AngularEditorComponent);
      fixture2.componentInstance.id = 'editor-2';
      fixture2.detectChanges();

      expect(component.id).not.toBe(fixture2.componentInstance.id);
      fixture2.destroy();
    });
  });

  // ==========================================================================
  // ngOnDestroy
  // ==========================================================================

  describe('ngOnDestroy', () => {
    it('should call blur and focus instance cleanup on destroy', () => {
      const blurSpy = vi.fn();
      const focusSpy = vi.fn();
      component.blurInstance = blurSpy;
      component.focusInstance = focusSpy;

      component.ngOnDestroy();

      expect(blurSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should not throw on destroy when no instances are set', () => {
      component.blurInstance = undefined;
      component.focusInstance = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  // ==========================================================================
  // executeCommand
  // ==========================================================================

  describe('executeCommand', () => {
    it('should not do anything when command is focus', () => {
      const execSpy = vi.spyOn(component['editorService'], 'executeCommand');
      component.executeCommand('focus');
      expect(execSpy).not.toHaveBeenCalled();
    });

    it('should toggle editor mode when command is toggleEditorMode', () => {
      const toggleSpy = vi.spyOn(component, 'toggleEditorMode');
      component.executeCommand('toggleEditorMode');
      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should call editorService.executeCommand for standard commands', () => {
      const execSpy = vi.spyOn(component['editorService'], 'executeCommand');
      component.executeCommand('bold');
      expect(execSpy).toHaveBeenCalledWith('bold', undefined);
    });

    it('should call editorService.executeCommand with value for colored commands', () => {
      const execSpy = vi.spyOn(component['editorService'], 'executeCommand');
      component.executeCommand('foreColor', '#ff0000');
      expect(execSpy).toHaveBeenCalledWith('foreColor', '#ff0000');
    });

    it('should not call editorService for empty command string', () => {
      const execSpy = vi.spyOn(component['editorService'], 'executeCommand');
      component.executeCommand('');
      expect(execSpy).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // onTextAreaMouseOut
  // ==========================================================================

  describe('onTextAreaMouseOut', () => {
    it('should call editorService.saveSelection', () => {
      const saveSpy = vi.spyOn(component['editorService'], 'saveSelection');
      const event = new MouseEvent('mouseout');
      component.onTextAreaMouseOut(event);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // refreshView
  // ==========================================================================

  describe('refreshView', () => {
    it('should set innerHTML of textArea with value', () => {
      component.config.sanitize = false;
      component.refreshView('<p>Refreshed</p>');
      expect(component.textArea.nativeElement.innerHTML).toContain('Refreshed');
    });

    it('should handle null value by setting empty string', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.refreshView(null as any);
      expect(component.textArea.nativeElement.innerHTML).toBe('');
    });
  });
});
