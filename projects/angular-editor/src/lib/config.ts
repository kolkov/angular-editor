import { UploadResponse } from './angular-editor.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomClass {
  name: string;
  class: string;
  tag?: string;
}

export interface Font {
  name: string;
  class: string;
}

export interface Headings {
  label: string;
  value: string;
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
  headings?: Headings[];
  customClasses?: CustomClass[];
  sanitize?: boolean;
  toolbarPosition?: 'top' | 'bottom';
  outline?: boolean;
  toolbarHiddenButtons?: string[][];
  rawPaste?: boolean;
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
  headings:[
    {
      label: 'Heading 1',
      value: 'h1',
    },
    {
      label: 'Heading 2',
      value: 'h2',
    },
    {
      label: 'Heading 3',
      value: 'h3',
    },
    {
      label: 'Heading 4',
      value: 'h4',
    },
    {
      label: 'Heading 5',
      value: 'h5',
    },
    {
      label: 'Heading 6',
      value: 'h6',
    },
    {
      label: 'Heading 7',
      value: 'h7',
    },
    {
      label: 'Paragraph',
      value: 'p',
    },
    {
      label: 'Predefined',
      value: 'pre'
    },
    {
      label: 'Standard',
      value: 'div'
    },
    {
      label: 'default',
      value: 'default'
    }
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
