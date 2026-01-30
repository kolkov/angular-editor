import { UploadResponse } from './angular-editor.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Custom class configuration for applying styles to selected content.
 *
 * @example
 * // Basic usage (inline span)
 * { name: 'Red Text', class: 'text-red' }
 *
 * // Block-level class (applies to each paragraph)
 * { name: 'Highlight', class: 'highlight', mode: 'block' }
 *
 * // Auto mode (smart detection)
 * { name: 'Quote', class: 'quote', mode: 'auto', tag: 'div' }
 */
export interface CustomClass {
  /** Display name shown in dropdown */
  name: string;
  /** CSS class to apply */
  class: string;
  /** HTML tag to use for wrapping (default: 'span') */
  tag?: string;
  /**
   * Application mode:
   * - 'inline': Always wrap selection in a single element (legacy behavior)
   * - 'block': Apply class to each block element in selection
   * - 'auto': Smart detection - inline for single block, block for multiple (default)
   */
  mode?: 'inline' | 'block' | 'auto';
}

export interface Font {
  name: string;
  class: string;
}

export interface AngularEditorConfig {
  editable?: boolean;
  spellcheck?: boolean;
  height?: 'auto' | string;
  minHeight?: '0' | string;
  maxHeight?: 'auto' | string;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  translate?: 'yes' | 'now' | string;
  enableToolbar?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
  defaultParagraphSeparator?: string;
  defaultFontName?: string;
  defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | string;
  uploadUrl?: string;
  upload?: (file: File) => Observable<HttpEvent<UploadResponse>>;
  uploadWithCredentials?: boolean;
  fonts?: Font[];
  customClasses?: CustomClass[];
  sanitize?: boolean;
  toolbarPosition?: 'top' | 'bottom';
  outline?: boolean;
  toolbarHiddenButtons?: string[][];
  rawPaste?: boolean;
  textDirection?: 'ltr' | 'rtl' | 'auto';
}

export const angularEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'},
    {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  outline: true,
  /*toolbarHiddenButtons: [
    ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
    ['heading', 'fontName', 'fontSize', 'color'],
    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
    ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
    ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
    ['link', 'unlink', 'image', 'video']
  ]*/
};
