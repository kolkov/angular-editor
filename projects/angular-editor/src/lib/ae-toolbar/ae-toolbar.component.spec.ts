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

    it('should have default block as "default"', () => {
      expect(component.block).toBe('default');
    });

    it('should have default fontName', () => {
      expect(component.fontName).toBe('Times New Roman');
    });

    it('should have default fontSize', () => {
      expect(component.fontSize).toBe('3');
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
    it('should set fontName when value is provided', () => {
      component.defaultFontName = 'Calibri';
      expect(component.fontName).toBe('Calibri');
    });

    it('should not change fontName when value is empty', () => {
      const original = component.fontName;
      component.defaultFontName = '';
      expect(component.fontName).toBe(original);
    });
  });

  describe('defaultFontSize setter', () => {
    it('should set fontSize when value is provided', () => {
      component.defaultFontSize = '5';
      expect(component.fontSize).toBe('5');
    });

    it('should not change fontSize when value is empty', () => {
      const original = component.fontSize;
      component.defaultFontSize = '';
      expect(component.fontSize).toBe(original);
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
      const btn = document.createElement('button');
      btn.id = 'toggleEditorMode-test-toolbar';
      document.body.appendChild(btn);

      component.setEditorMode(true);
      expect(component.htmlMode).toBe(true);

      document.body.removeChild(btn);
    });

    it('should set htmlMode to false when m is false', () => {
      const btn = document.createElement('button');
      btn.id = 'toggleEditorMode-test-toolbar';
      document.body.appendChild(btn);

      component.setEditorMode(true);
      component.setEditorMode(false);
      expect(component.htmlMode).toBe(false);

      document.body.removeChild(btn);
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
  // triggerButtons
  // ==========================================================================

  describe('triggerButtons', () => {
    it('should not query command state when showToolbar is false', () => {
      component.showToolbar = false;
      const queryMock = vi.fn().mockReturnValue(false);
      Object.defineProperty(document, 'queryCommandState', {
        value: queryMock,
        writable: true,
        configurable: true,
      });

      component.triggerButtons();
      expect(queryMock).not.toHaveBeenCalled();
    });

    it('should query command state for each button when showToolbar is true', () => {
      component.showToolbar = true;
      const queryMock = vi.fn().mockReturnValue(false);
      Object.defineProperty(document, 'queryCommandState', {
        value: queryMock,
        writable: true,
        configurable: true,
      });

      component.triggerButtons();
      // There are 15 buttons in the buttons array
      expect(queryMock).toHaveBeenCalled();
      expect(queryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // triggerBlocks
  // ==========================================================================

  describe('triggerBlocks', () => {
    it('should not process when showToolbar is false', () => {
      component.showToolbar = false;
      component.triggerBlocks([]);
      // block stays default since showToolbar is false
      expect(component.block).toBe('default');
    });

    it('should detect link selection when A node is present', () => {
      component.showToolbar = true;

      const aElement = document.createElement('a');
      aElement.id = 'link-test-toolbar';
      document.body.appendChild(aElement);

      // Create a mock node with nodeName A
      const mockNode = { nodeName: 'A' } as Node;
      component.triggerBlocks([mockNode]);
      expect(component.linkSelected).toBe(true);

      document.body.removeChild(aElement);
    });

    it('should set block to h1 when H1 node is present', () => {
      component.showToolbar = true;

      const mockNode = { nodeName: 'H1' } as Node;
      component.triggerBlocks([mockNode]);
      expect(component.block).toBe('h1');
    });

    it('should reset block to default when no heading found', () => {
      component.showToolbar = true;
      component.block = 'h2';

      component.triggerBlocks([]);
      expect(component.block).toBe('default');
    });

    it('should set linkSelected to false when no A node present', () => {
      component.showToolbar = true;
      component.linkSelected = true;

      component.triggerBlocks([]);
      expect(component.linkSelected).toBe(false);
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
