import {
  AfterViewInit, Attribute, ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef, HostBinding, HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AngularEditorConfig, angularEditorConfig} from './config';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {AngularEditorService} from './angular-editor.service';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
  selector: 'angular-editor',
  templateUrl: './angular-editor.component.html',
  styleUrls: ['./angular-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularEditorComponent),
      multi: true
    }
  ]
})
export class AngularEditorComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  private onChange: (value: string) => void;
  private onTouched: () => void;

  modeVisual = true;
  showPlaceholder = false;
  disabled = false;
  @Input() id = '';
  @Input() config: AngularEditorConfig = angularEditorConfig;
  @Input() placeholder = '';
  @Input() tabIndex: number | null;

  @Output() html;

  @ViewChild('editor') textArea: any;
  @ViewChild('editorWrapper') editorWrapper: any;
  @ViewChild('editorToolbar') editorToolbar: AngularEditorToolbarComponent;

  @Output() viewMode = new EventEmitter<boolean>();

  /** emits `blur` event when focused out from the textarea */
    // tslint:disable-next-line:no-output-native
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();

  /** emits `focus` event when focused in to the textarea */
    // tslint:disable-next-line:no-output-native
  @Output() focus: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.tabindex') tabindex = -1;
  @HostListener('focus') onFocus() {
    this.onEditorFocus();
  }

  constructor(
    private r: Renderer2,
    private editorService: AngularEditorService,
    @Inject(DOCUMENT) private doc: any,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
  }

  ngOnInit() {
    if (this.config.defaultParagraphSeparator) {
      this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
    }
  }

  ngAfterViewInit() {
    this.editorToolbar.id = this.id;
    this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    if (this.config.showToolbar !== undefined) {
      this.editorToolbar.showToolbar = this.config.showToolbar;
    }
    this.editorToolbar.fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
    this.editorToolbar.customClasses = this.config.customClasses;
    this.editorToolbar.uploadUrl = this.config.uploadUrl;
    this.editorService.uploadUrl = this.config.uploadUrl;
    if (this.config.defaultFontName) {
      this.editorToolbar.fontName = this.config.defaultFontName;
      this.onEditorFocus();
      this.editorService.setFontName(this.config.defaultFontName);
    } else {
      this.editorToolbar.fontName = 'Times New Roman';
    }
    if (this.config.defaultFontSize) {
      this.editorToolbar.fontSize = this.config.defaultFontSize;
      this.onEditorFocus();
      this.editorService.setFontSize(this.config.defaultFontSize);
    }
    this.cdRef.detectChanges();
  }

  /**
   * Executed command from editor header buttons
   * @param command string from triggerCommand
   */
  executeCommand(command: string) {
    this.onEditorFocus();
    if (command === 'toggleEditorMode') {
      this.toggleEditorMode(this.modeVisual);
    } else if (command !== '') {
      if (command === 'default') {
        this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
        this.onContentChange(this.textArea.nativeElement.innerHTML);
      } else {
        this.editorService.executeCommand(command);
      }
      this.exec();
    }
  }

  /**
   * focus event
   */
  onTextAreaFocus(): void {
    this.focus.emit('focus');
  }

  /**
   * @description fires when cursor leaves textarea
   */
  public onTextAreaMouseOut(event: MouseEvent): void {
    this.editorService.saveSelection();
  }

  /**
   * blur event
   */
  onTextAreaBlur(event: FocusEvent) {
    /**
     * save selection if focussed out
     */
    this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);

    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }

    if (event.relatedTarget != null && (event.relatedTarget as HTMLElement).parentElement.className !== 'angular-editor-toolbar-set') {
    this.blur.emit('blur');
    }
  }

  /**
   *  focus the text area when the editor is focussed
   */
  onEditorFocus() {
    if (this.modeVisual) {
      this.textArea.nativeElement.focus();
    } else {
      const sourceText = this.doc.getElementById('sourceText');
      sourceText.focus();
    }
  }

  /**
   * Executed from the contenteditable section while the input property changes
   * @param html html string from contenteditable
   */
  onContentChange(html: string): void {
    if ((!html || html === '<br>')) { html = ''; }
    if (typeof this.onChange === 'function') {
      this.onChange(this.config.sanitize || this.config.sanitize === undefined ?
        this.sanitizer.sanitize(SecurityContext.HTML, html) : html);
      if ((!html) !== this.showPlaceholder) {
        this.togglePlaceholder(this.showPlaceholder);
      }
    }
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Set the function to be called
   * when the control receives a touch event.
   *
   * @param fn a function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write a new value to the element.
   *
   * @param value value to be executed when there is a change in contenteditable
   */
  writeValue(value: any): void {

    if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
      this.togglePlaceholder(this.showPlaceholder);
    }

    if (value === null || value === undefined || value === '' || value === '<br>') {
      value = null;
    }

    this.refreshView(value);
  }

  /**
   * refresh view/HTML of the editor
   *
   * @param value html string from the editor
   */
  refreshView(value: string): void {
    const normalizedValue = value === null ? '' : value;
    this.r.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);

    return;
  }

  /**
   * toggles placeholder based on input string
   *
   * @param value A HTML string from the editor
   */
  togglePlaceholder(value: boolean): void {
    if (!value) {
      this.r.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = true;

    } else {
      this.r.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = false;
    }
  }

  /**
   * Implements disabled state for this element
   *
   * @param isDisabled Disabled flag
   */
  setDisabledState(isDisabled: boolean): void {
    const div = this.textArea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }

  /**
   * toggles editor mode based on bToSource bool
   *
   * @param bToSource A boolean value from the editor
   */
  toggleEditorMode(bToSource: boolean) {
    let oContent: any;
    const editableElement = this.textArea.nativeElement;

    if (bToSource) {
      oContent = this.doc.createTextNode(editableElement.innerHTML);
      editableElement.innerHTML = '';

      const oPre = this.doc.createElement('pre');
      oPre.setAttribute('style', 'margin: 0; outline: none;');
      const oCode = this.doc.createElement('code');
      editableElement.contentEditable = false;
      oCode.id = 'sourceText';
      oCode.setAttribute('style', 'display:block; white-space: pre-wrap; word-break:' +
        ' keep-all; margin: 0; outline: none; background-color: #fff5b9;');
      oCode.contentEditable = 'true';
      oCode.appendChild(oContent);
      oPre.appendChild(oCode);
      editableElement.appendChild(oPre);

      this.doc.execCommand('defaultParagraphSeparator', false, 'div');

      this.modeVisual = false;
      this.viewMode.emit(false);
      oCode.focus();
    } else {
      if (this.doc.querySelectorAll) {
        editableElement.innerHTML = editableElement.innerText;
      } else {
        oContent = this.doc.createRange();
        oContent.selectNodeContents(editableElement.firstChild);
        editableElement.innerHTML = oContent.toString();
      }
      editableElement.contentEditable = true;
      this.modeVisual = true;
      this.viewMode.emit(true);
      this.onContentChange(editableElement.innerHTML);
      editableElement.focus();
    }
    this.editorToolbar.setEditorMode(!this.modeVisual);
  }

  /**
   * toggles editor buttons when cursor moved or positioning
   *
   * Send a node array from the contentEditable of the editor
   */
  exec() {
    this.editorToolbar.triggerButtons();

    let userSelection;
    if (this.doc.getSelection) {
      userSelection = this.doc.getSelection();
      this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
    }

    let a = userSelection.focusNode;
    const els = [];
    while (a && a.id !== 'editor') {
      els.unshift(a);
      a = a.parentNode;
    }
    this.editorToolbar.triggerBlocks(els);
  }

}
