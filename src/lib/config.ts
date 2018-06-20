export interface AngularEditorConfig {
  editable?: boolean,
  spellcheck?: boolean,
  height?: 'auto' | string,
  minHeight?: '0' | string,
  width?: 'auto' | string,
  minWidth?: '0' | string,
  translate?: 'yes' | 'now' | string,
  enableToolbar?: boolean,
  showToolbar?: boolean,
  placeholder?: string,
  defaultParagraphSeparator?: string;
  defaultFontName?: string;
  defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' |string;
  uploadUrl?: string;
}

export const angularEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  uploadUrl: 'v1/image',
};
