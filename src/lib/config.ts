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
  defaultParagraphSeparator: ''
};
