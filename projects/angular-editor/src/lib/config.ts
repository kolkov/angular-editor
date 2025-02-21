export declare interface AngularEditorConfig {
    editable: boolean;
    spellcheck: boolean;
    translate: 'yes' | 'no' | string;
    enableToolbar: boolean;
    showToolbar: boolean;
    placeholder: string;
    defaultParagraphSeparator: string;
    defaultFontName: string;
    defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | string;
    fonts: Font[];
    customClasses: CustomClass[];
    sanitize: boolean;
    toolbarPosition: 'top' | 'bottom';
    outline: boolean;
    toolbarHiddenButtons: Partial<HiddenButtons>;
    rawPaste: boolean;
}

export declare interface Font {
    name: string;
    class: string;
}

export declare interface CustomClass {
    name: string;
    class: string;
    tag?: string;
}

export declare type HiddenButtons = {
    style: StyleOptions[];
    font: FontOptions[];
    textAlign: TextAlignOptions[];
    editOptions: EditOptions[];
    specialFormats: SpecialFormats[];
    mediaOptions: MediaOptions[];
};

export declare type StyleOptions =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikeThrough'
    | 'superscript'
    | 'subscript';

export declare type FontOptions = 'heading' | 'fontName' | 'fontSize' | 'color';

export declare type TextAlignOptions =
    | 'justifyLeft'
    | 'justifyCenter'
    | 'justifyRight'
    | 'justifyFull'
    | 'indent'
    | 'outdent';

export declare type EditOptions =
    | 'cut'
    | 'copy'
    | 'delete'
    | 'removeFormat'
    | 'undo'
    | 'redo';

export declare type SpecialFormats =
    | 'paragraph'
    | 'blockquote'
    | 'removeBlockquote'
    | 'horizontalLine'
    | 'orderedList'
    | 'unorderedList';

export declare type MediaOptions = 'link' | 'unlink' | 'image' | 'video';
