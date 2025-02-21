import { AngularEditorConfig } from '@angular-elements/rich-text-editor';

export const editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
        {
            name: 'quote',
            class: 'quote'
        },
        {
            name: 'redText',
            class: 'redText'
        },
        {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1'
        }
    ],
    toolbarHiddenButtons: {
        style: ['bold', 'italic']
    }
};
