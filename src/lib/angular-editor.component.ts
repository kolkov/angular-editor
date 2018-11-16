import {
  AfterContentInit,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AngularEditorConfig, angularEditorConfig} from "./config";
import {AngularEditorToolbarComponent} from "./angular-editor-toolbar.component";
import {AngularEditorService} from "./angular-editor.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'angular-editor',
  templateUrl: "./angular-editor.component.html",
  styleUrls: ["./angular-editor.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularEditorComponent),
      multi: true
    }
  ]
})
export class AngularEditorComponent implements OnInit, ControlValueAccessor, AfterContentInit {

  private onChange: (value: string) => void;
  private onTouched: () => void;

  placeholder: boolean;

  modeVisual = true;
  showPlaceholder = false;
  @Input() id = '';
  @Input() config: AngularEditorConfig = angularEditorConfig;

  @Output() html;

  @ViewChild('editor') textArea: any;
  @ViewChild('editorWrapper') editorWrapper: any;
  @ViewChild('editorToolbar') editorToolbar: AngularEditorToolbarComponent;

  @Output() viewMode = new EventEmitter<boolean>();

  /** emits `blur` event when focused out from the textarea */
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();

  /** emits `focus` event when focused in to the textarea */
  @Output() focus: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _renderer: Renderer2, private editorService: AngularEditorService, @Inject(DOCUMENT) private _document: any) {
  }

  ngOnInit() {
    this.editorToolbar.id = this.id;
    this.editorToolbar.fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
    this.editorToolbar.customClasses = this.config.customClasses;
    this.editorService.uploadUrl = this.config.uploadUrl;
    if (this.config.showToolbar !== undefined) {
      this.editorToolbar.showToolbar = this.config.showToolbar;
    }
    if (this.config.defaultParagraphSeparator) {
      this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
    }
  }

  ngAfterContentInit() {
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
  }

  /**
   * Executed command from editor header buttons
   * @param command string from triggerCommand
   */
  executeCommand(command: string) {
    if (command === 'toggleEditorMode') {
      this.toggleEditorMode(this.modeVisual);
    } else if (command !== '') {
      this.editorService.executeCommand(command);
      this.exec();
    }

    this.onEditorFocus();
  }

  /**
   * focus event
   */
  onTextAreaFocus(): void {
    this.focus.emit('focus');
  }

  /**
   * blur event
   */
  onTextAreaBlur(event: FocusEvent) {
    /**
     * save selection if focussed out
     */
    this.editorService.saveSelection();

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
    this.textArea.nativeElement.focus();
  }

  /**
   * Executed from the contenteditable section while the input property changes
   * @param html html string from contenteditable
   */
  onContentChange(html: string): void {

    if (typeof this.onChange === 'function') {
      this.onChange(html);
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
   * @param isDisabled
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
      oPre.setAttribute("style", "margin: 0; outline: none;");
      const oCode = this._document.createElement('code');
      editableElement.contentEditable = false;
      oCode.id = "sourceText";
      oCode.setAttribute("style", "white-space: pre-wrap; word-break: keep-all; margin: 0; outline: none; background-color: #fff5b9;");
      oCode.contentEditable = 'true';
      oCode.appendChild(oContent);
      oPre.appendChild(oCode);
      editableElement.appendChild(oPre);

      this._document.execCommand("defaultParagraphSeparator", false, "div");

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
    if (window.getSelection) {
      userSelection = window.getSelection();
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
