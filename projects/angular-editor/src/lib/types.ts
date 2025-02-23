export declare type Block =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'code';

export declare type CommandId =
    | Block
    | 'bold'
    | 'clear'
    | 'createlink'
    | 'default'
    | 'defaultParagraphSeparator'
    | 'focus'
    | 'foreColor'
    | 'formatBlock'
    | 'hiliteColor'
    | 'indent'
    | 'insertHTML'
    | 'insertHorizontalRule'
    | 'insertImage'
    | 'insertOrderedList'
    | 'insertUnorderedList'
    | 'italic'
    | 'justifyCenter'
    | 'justifyFull'
    | 'justifyLeft'
    | 'justifyRight'
    | 'outdent'
    | 'redo'
    | 'removeFormat'
    | 'strikeThrough'
    | 'subscript'
    | 'superscript'
    | 'toggleEditorMode'
    | 'underline'
    | 'undo';

export interface SelectOption<T = string> {
    label: string;
    value: T;
}
