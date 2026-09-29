import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AeToolbarComponent } from './ae-toolbar.component';
import { AngularEditorService } from '../angular-editor.service';

describe('AeToolbarComponent', () => {
  let component: AeToolbarComponent;
  let fixture: ComponentFixture<AeToolbarComponent>;
  let editorService: AngularEditorService;

  beforeEach(async () => {
    // Mock document methods that jsdom does not implement
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(false),
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

    await TestBed.configureTestingModule({
      declarations: [AeToolbarComponent],
      providers: [
        provideHttpClient(),
        AngularEditorService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    editorService = TestBed.inject(AngularEditorService);
    fixture = TestBed.createComponent(AeToolbarComponent);
    component = fixture.componentInstance;
    component.id = 'test-toolbar';
    component.showToolbar = true;
    component.fonts = [{ label: 'Arial', value: 'Arial' }];
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

    it('should start in visual mode (htmlMode false)', () => {
      expect(component.htmlMode).toBe(false);
    });

    it('should expose editorService with default formatting state', () => {
      expect(editorService.currentBlock()).toBe('default');
      expect(editorService.currentFontSize()).toBe('3');
      expect(editorService.isBold()).toBe(false);
    });
  });

  // ==========================================================================
  // isButtonHidden
  // ==========================================================================

  describe('isButtonHidden', () => {
    it('should return false for empty name', () => {
      expect(component.isButtonHidden('')).toBe(false);
    });

    it('should return false when hiddenButtons is not an array', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.hiddenButtons = 'notanarray' as any;
      expect(component.isButtonHidden('bold')).toBe(false);
    });

    it('should return false when button is not in hiddenButtons', () => {
      component.hiddenButtons = [['italic', 'underline']];
      expect(component.isButtonHidden('bold')).toBe(false);
    });

    it('should return true when button is in hiddenButtons', () => {
      component.hiddenButtons = [['bold', 'italic']];
      expect(component.isButtonHidden('bold')).toBe(true);
    });

    it('should return true when button is in a nested array', () => {
      component.hiddenButtons = [['undo', 'redo'], ['bold']];
      expect(component.isButtonHidden('bold')).toBe(true);
    });

    it('should return false for empty hiddenButtons array', () => {
      component.hiddenButtons = [];
      expect(component.isButtonHidden('bold')).toBe(false);
    });
  });

  // ==========================================================================
  // isLinkButtonDisabled
  // ==========================================================================

  describe('isLinkButtonDisabled', () => {
    it('should be disabled when in HTML mode', () => {
      component.htmlMode = true;
      editorService.selectedText = 'some text';
      expect(component.isLinkButtonDisabled).toBe(true);
    });

    it('should be disabled when no text is selected', () => {
      component.htmlMode = false;
      editorService.selectedText = '';
      expect(component.isLinkButtonDisabled).toBe(true);
    });

    it('should be enabled when not in HTML mode and text is selected', () => {
      component.htmlMode = false;
      editorService.selectedText = 'some text';
      expect(component.isLinkButtonDisabled).toBe(false);
    });
  });

  // ==========================================================================
  // customClasses setter
  // ==========================================================================

  describe('customClasses setter', () => {
    it('should build customClassList from provided classes', () => {
      component.customClasses = [
        { name: 'Highlight', class: 'highlight' },
        { name: 'Bold Red', class: 'bold-red' },
      ];

      // 2 classes + "Clear Class" = 3
      expect(component.customClassList.length).toBe(3);
    });

    it('should add "Clear Class" option at the start', () => {
      component.customClasses = [{ name: 'Test', class: 'test' }];
      expect(component.customClassList[0].label).toBe('Clear Class');
      expect(component.customClassList[0].value).toBe('-1');
    });

    it('should map class names to select options', () => {
      component.customClasses = [{ name: 'My Style', class: 'my-style' }];
      expect(component.customClassList[1].label).toBe('My Style');
      expect(component.customClassList[1].value).toBe('0');
    });
  });

  // ==========================================================================
  // defaultFontName / defaultFontSize setters
  // ==========================================================================

  describe('defaultFontName setter', () => {
    it('should update service formatting state when value is provided', () => {
      component.defaultFontName = 'Calibri';
      expect(editorService.currentFontName()).toBe('Calibri');
    });

    it('should not change state when value is empty', () => {
      editorService.setInitialState({fontName: 'Arial'});
      component.defaultFontName = '';
      expect(editorService.currentFontName()).toBe('Arial');
    });
  });

  describe('defaultFontSize setter', () => {
    it('should update service formatting state when value is provided', () => {
      component.defaultFontSize = '5';
      expect(editorService.currentFontSize()).toBe('5');
    });

    it('should not change state when value is empty', () => {
      editorService.setInitialState({fontSize: '4'});
      component.defaultFontSize = '';
      expect(editorService.currentFontSize()).toBe('4');
    });
  });

  // ==========================================================================
  // triggerCommand / execute output
  // ==========================================================================

  describe('triggerCommand', () => {
    it('should emit the command via execute output', () => {
      const emitSpy = vi.spyOn(component.execute, 'emit');
      component.triggerCommand('bold');
      expect(emitSpy).toHaveBeenCalledWith('bold');
    });

    it('should emit undo command', () => {
      const emitSpy = vi.spyOn(component.execute, 'emit');
      component.triggerCommand('undo');
      expect(emitSpy).toHaveBeenCalledWith('undo');
    });
  });

  // ==========================================================================
  // setEditorMode
  // ==========================================================================

  describe('setEditorMode', () => {
    it('should set htmlMode to true when m is true', () => {
      component.setEditorMode(true);
      expect(component.htmlMode).toBe(true);
    });

    it('should set htmlMode to false when m is false', () => {
      component.setEditorMode(true);
      component.setEditorMode(false);
      expect(component.htmlMode).toBe(false);
    });
  });

  // ==========================================================================
  // setCustomClass
  // ==========================================================================

  describe('setCustomClass', () => {
    it('should emit clear when classId is -1', () => {
      const emitSpy = vi.spyOn(component.execute, 'emit');
      component.setCustomClass('-1');
      expect(emitSpy).toHaveBeenCalledWith('clear');
    });

    it('should call editorService.createCustomClass for valid class id', () => {
      const createSpy = vi.spyOn(editorService, 'createCustomClass').mockImplementation(() => {});
      component.customClasses = [{ name: 'Test', class: 'test-class' }];
      component.setCustomClass('0');
      expect(createSpy).toHaveBeenCalledWith({ name: 'Test', class: 'test-class' });
    });
  });

  // ==========================================================================
  // setFontName / setFontSize
  // ==========================================================================

  describe('setFontName', () => {
    it('should call editorService.setFontName and emit empty execute', () => {
      const setNameSpy = vi.spyOn(editorService, 'setFontName').mockImplementation(() => {});
      const emitSpy = vi.spyOn(component.execute, 'emit');

      component.setFontName('Calibri');

      expect(setNameSpy).toHaveBeenCalledWith('Calibri');
      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  describe('setFontSize', () => {
    it('should call editorService.setFontSize and emit empty execute', () => {
      const setSizeSpy = vi.spyOn(editorService, 'setFontSize').mockImplementation(() => {});
      const emitSpy = vi.spyOn(component.execute, 'emit');

      component.setFontSize('4');

      expect(setSizeSpy).toHaveBeenCalledWith('4');
      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  // ==========================================================================
  // insertColor
  // ==========================================================================

  describe('insertColor', () => {
    it('should call editorService.insertColor and emit empty execute', () => {
      const insertColorSpy = vi.spyOn(editorService, 'insertColor').mockImplementation(() => {});
      const emitSpy = vi.spyOn(component.execute, 'emit');

      component.insertColor('#ff0000', 'textColor');

      expect(insertColorSpy).toHaveBeenCalledWith('#ff0000', 'textColor');
      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  // ==========================================================================
  // Reactive formatting state (via AngularEditorService signals)
  // ==========================================================================

  describe('reactive formatting state', () => {
    it('should reflect bold state from service signal', () => {
      expect(editorService.isBold()).toBe(false);
      editorService.setInitialState({bold: true});
      expect(editorService.isBold()).toBe(true);
    });

    it('should reflect italic state from service signal', () => {
      editorService.setInitialState({italic: true});
      expect(editorService.isItalic()).toBe(true);
    });

    it('should reflect all toggle states', () => {
      editorService.setInitialState({
        bold: true, italic: true, underline: true,
        strikeThrough: true, subscript: true, superscript: true,
      });
      expect(editorService.isBold()).toBe(true);
      expect(editorService.isItalic()).toBe(true);
      expect(editorService.isUnderline()).toBe(true);
      expect(editorService.isStrikeThrough()).toBe(true);
      expect(editorService.isSubscript()).toBe(true);
      expect(editorService.isSuperscript()).toBe(true);
    });

    it('should reflect alignment states', () => {
      editorService.setInitialState({justifyCenter: true});
      expect(editorService.isJustifyCenter()).toBe(true);
      expect(editorService.isJustifyLeft()).toBe(false);
    });

    it('should reflect list states', () => {
      editorService.setInitialState({insertUnorderedList: true});
      expect(editorService.isUnorderedList()).toBe(true);
      expect(editorService.isOrderedList()).toBe(false);
    });

    it('should reflect link selection from service signal', () => {
      expect(editorService.isLinkSelected()).toBe(false);
      editorService.setInitialState({linkSelected: true});
      expect(editorService.isLinkSelected()).toBe(true);
    });

    it('should reflect block type from service signal', () => {
      expect(editorService.currentBlock()).toBe('default');
      editorService.setInitialState({block: 'h1'});
      expect(editorService.currentBlock()).toBe('h1');
    });

    it('should reflect font name from service signal', () => {
      editorService.setInitialState({fontName: 'Calibri'});
      expect(editorService.currentFontName()).toBe('Calibri');
    });

    it('should reflect font size from service signal', () => {
      editorService.setInitialState({fontSize: '5'});
      expect(editorService.currentFontSize()).toBe('5');
    });

    it('should reflect custom class id from service signal', () => {
      editorService.setInitialState({customClassId: '2'});
      expect(editorService.currentCustomClassId()).toBe('2');
    });
  });

  // ==========================================================================
  // detectFormattingState (service method)
  // ==========================================================================

  describe('detectFormattingState', () => {
    it('should detect block type from ancestor nodes', () => {
      const mockNode = {nodeName: 'H1'} as Node;
      editorService.detectFormattingState([mockNode]);
      expect(editorService.currentBlock()).toBe('h1');
    });

    it('should reset block to default when no heading found', () => {
      editorService.setInitialState({block: 'h2'});
      editorService.detectFormattingState([]);
      expect(editorService.currentBlock()).toBe('default');
    });

    it('should detect link selection from A node', () => {
      const mockNode = {nodeName: 'A'} as Node;
      editorService.detectFormattingState([mockNode]);
      expect(editorService.isLinkSelected()).toBe(true);
      expect(editorService.isLink()).toBe(true);
    });

    it('should clear link selection when no A node', () => {
      editorService.setInitialState({linkSelected: true, link: true});
      editorService.detectFormattingState([]);
      expect(editorService.isLinkSelected()).toBe(false);
    });

    it('should detect indent from BLOCKQUOTE ancestor', () => {
      const mockNode = {nodeName: 'BLOCKQUOTE'} as Node;
      editorService.detectFormattingState([mockNode]);
      expect(editorService.isIndent()).toBe(true);
    });

    it('should detect custom class from ancestor nodes', () => {
      const mockElement = document.createElement('div');
      mockElement.className = 'highlight';
      const customClasses = [{name: 'Highlight', class: 'highlight'}];

      editorService.detectFormattingState([mockElement], customClasses);
      expect(editorService.currentCustomClassId()).toBe('0');
    });

    it('should reset custom class when no matching ancestor', () => {
      editorService.setInitialState({customClassId: '1'});
      const customClasses = [{name: 'Highlight', class: 'highlight'}];

      editorService.detectFormattingState([], customClasses);
      expect(editorService.currentCustomClassId()).toBe('-1');
    });
  });

  // ==========================================================================
  // focus
  // ==========================================================================

  describe('focus', () => {
    it('should emit focus command via execute', () => {
      const emitSpy = vi.spyOn(component.execute, 'emit');
      component.focus();
      expect(emitSpy).toHaveBeenCalledWith('focus');
    });
  });

  // ==========================================================================
  // watchUploadImage
  // ==========================================================================

  describe('watchUploadImage', () => {
    it('should call editorService.insertImage with the image URL from response body', () => {
      const insertSpy = vi.spyOn(editorService, 'insertImage').mockImplementation(() => {});

      const response = new HttpResponse({
        body: { imageUrl: 'https://example.com/uploaded.jpg' },
      });
      const event = { srcElement: { value: '' } };

      component.watchUploadImage(response, event);

      expect(insertSpy).toHaveBeenCalledWith('https://example.com/uploaded.jpg');
    });
  });
});
