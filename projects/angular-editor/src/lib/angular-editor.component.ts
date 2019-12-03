import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input, OnDestroy,
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
export class AngularEditorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  private onChange: (value: string) => void;
  private onTouched: () => void;

  modeVisual = true;
  showPlaceholder = false;
  @Input() id = '';
  @Input() config: AngularEditorConfig = angularEditorConfig;
  @Input() placeholder = '';

  @Output() html;

  // @ts-ignore
  @ViewChild('editor') textArea: any;
  // @ts-ignore
  @ViewChild('editorWrapper') editorWrapper: any;
  // @ts-ignore
  @ViewChild('editorToolbar') editorToolbar: AngularEditorToolbarComponent;

  @Output() viewMode = new EventEmitter<boolean>();

  /** emits `blur` event when focused out from the textarea */
    // tslint:disable-next-line:no-output-native
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();

  /** emits `focus` event when focused in to the textarea */
    // tslint:disable-next-line:no-output-native
  @Output() focus: EventEmitter<string> = new EventEmitter<string>();

  /*
     * MutationObserver IE11 fallback (as opposed to input event for modern browsers).
     * When mutation removes a tag, i.e. delete is pressed on the last remaining character
     * inside a tag — callback is triggered before the DOM is actually changed, therefore
     * setTimeout is used
     */
  private observer = new MutationObserver(() => {
    setTimeout(() => {
      this.onChange(
          this.textArea.nativeElement.innerHTML
      );
    });
  });

  constructor(
    // tslint:disable-next-line:variable-name
    private _renderer: Renderer2,
    private editorService: AngularEditorService,
    // tslint:disable-next-line:variable-name
    @Inject(DOCUMENT) private _document: any,
    // tslint:disable-next-line:variable-name
    private _domSanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    if (this.config.defaultParagraphSeparator) {
      this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
    }
  }

  ngAfterViewInit() {
    this.editorToolbar.id = this.id;
    if (this.config.showToolbar !== undefined) {
      this.editorToolbar.showToolbar = this.config.showToolbar;
    }
    this.editorToolbar.fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
    this.editorToolbar.customClasses = this.config.customClasses;
    this.editorToolbar.uploadUrl = this.config.uploadUrl;
    this.editorService.uploadUrl = this.config.uploadUrl;
    if (this.config.defaultFontName) {
      this.editorToolbar.defaultFontId = this.config.defaultFontName ? this.editorToolbar.fonts.findIndex(x => {
        return x.name === this.config.defaultFontName;
      }) : 0;
      this.editorToolbar.fontId = this.editorToolbar.defaultFontId;
      this.onEditorFocus();
      this.editorService.setFontName(this.config.defaultFontName);
    } else {
      this.editorToolbar.defaultFontId = 0;
      this.editorToolbar.fontId = 0;
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
      const sourceText = this._document.getElementById('sourceText');
      // sourceText.textContent = '1';
      sourceText.focus();
    }
  }

  /**
   * Executed from the contenteditable section while the input property changes
   * @param element html element from contenteditable
   */
  onContentChange(element: HTMLElement): void {
    let html = '';
    if (this.modeVisual) {
      html = element.innerHTML;
    } else {
      html = element.innerText;
    }
    this.observer.disconnect();
    if (typeof this.onChange === 'function') {
      this.onChange(this.config.sanitize ||
      this.config.sanitize === undefined ? this._domSanitizer.sanitize(SecurityContext.HTML, html) : html);
      if ((!html || html === '<br>' || html === '') !== this.showPlaceholder) {
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
    this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);

    return;
  }

  /**
   * toggles placeholder based on input string
   *
   * @param value A HTML string from the editor
   */
  togglePlaceholder(value: boolean): void {
    if (!value) {
      this._renderer.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = true;

    } else {
      this._renderer.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = false;
    }
  }

  /**
   * Implements disabled state for this element
   *
   * isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    const div = this.textArea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this._renderer[action](div, 'disabled');
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
      oContent = this._document.createTextNode(editableElement.innerHTML);
      editableElement.innerHTML = '';

      const oPre = this._document.createElement('pre');
      oPre.setAttribute('style', 'margin: 0; outline: none;');
      const oCode = this._document.createElement('code');
      editableElement.contentEditable = false;
      oCode.id = 'sourceText';
      oCode.setAttribute('style', 'display:block; white-space: pre-wrap; word-break:' +
        ' keep-all; margin: 0; outline: none; background-color: #fff5b9;');
      oCode.contentEditable = 'true';
      oCode.placeholder = 'test';
      oCode.appendChild(oContent);
      oPre.appendChild(oCode);
      editableElement.appendChild(oPre);

      this._document.execCommand('defaultParagraphSeparator', false, 'div');

      this.modeVisual = false;
      this.viewMode.emit(false);
      oCode.focus();
    } else {
      if (this._document.all) {
        editableElement.innerHTML = editableElement.innerText;
      } else {
        oContent = this._document.createRange();
        oContent.selectNodeContents(editableElement.firstChild);
        editableElement.innerHTML = oContent.toString();
      }
      editableElement.contentEditable = true;
      this.modeVisual = true;
      this.viewMode.emit(true);
      this.onContentChange(editableElement);
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
    if (this._document.getSelection) {
      userSelection = this._document.getSelection();
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

  /*
       * Disconnect MutationObserver IE11 fallback on destroy
       */
  ngOnDestroy() {
    this.observer.disconnect();
  }
}

