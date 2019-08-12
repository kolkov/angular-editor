import { SelectOption } from './ae-select/ae-select.component';

export interface AngularEditorToolbarConfig {
    showUndoRedoOptions?: boolean;
    showUndo?: boolean;
    showRedo?: boolean;
    showFormatOptions?: boolean;
    showBold?: boolean;
    showItalic?: boolean;
    showUnderline?: boolean;
    showStrikeThrough?: boolean;
    showSubscript?: boolean;
    showSuperscript?: boolean;
    showJustifyOptions?: boolean;
    showJustifyLeft?: boolean;
    showJustifyCenter?: boolean;
    showJustifyRight?: boolean;
    showJustifyFull?: boolean;
    showIndentOptions?: boolean;
    showIndent?: boolean;
    showOutdent?: boolean;
    showListOptions?: boolean;
    showUnorderedList?: boolean;
    showOrderedList?: boolean;
    showHeadingOptions?: boolean;
    showFontSelect?: boolean;
    showFontSizeOptions?: boolean;
    showColorOptions?: boolean;
    showCustomClassesSelect?: boolean;
    showMediaOptions?: boolean;
    showLink?: boolean;
    showUnlink?: boolean;
    showInsertImage?: boolean;
    showInsertVideo?: boolean;
    showHorizontalRule?: boolean;
    showClearFormat?: boolean;
    showToggleEditorMode?: boolean;
    headings?: SelectOption[];
}

export const angularEditorToolbarDefaultConfig: AngularEditorToolbarConfig = {
    showUndoRedoOptions: true,
    showUndo: true,
    showRedo: true,
    showFormatOptions: true,
    showBold: true,
    showItalic: true,
    showUnderline: true,
    showStrikeThrough: true,
    showSubscript: true,
    showSuperscript: true,
    showJustifyOptions: true,
    showJustifyLeft: true,
    showJustifyCenter: true,
    showJustifyRight: true,
    showJustifyFull: true,
    showIndentOptions: true,
    showIndent: true,
    showOutdent: true,
    showListOptions: true,
    showUnorderedList: true,
    showOrderedList: true,
    showHeadingOptions: true,
    showFontSelect: true,
    showFontSizeOptions: true,
    showColorOptions: true,
    showCustomClassesSelect: true,
    showMediaOptions: true,
    showLink: true,
    showUnlink: true,
    showInsertImage: true,
    showInsertVideo: true,
    showHorizontalRule: true,
    showClearFormat: true,
    showToggleEditorMode: true,
};
