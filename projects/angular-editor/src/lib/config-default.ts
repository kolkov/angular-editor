import { AngularEditorConfig } from './config';

export function loadDefaultConfig(
    editorConfig: Partial<AngularEditorConfig> = {}
) {
    editorConfig.editable ??= true;
    editorConfig.spellcheck ??= true;
    editorConfig.translate ??= 'yes';
    editorConfig.enableToolbar ??= true;
    editorConfig.showToolbar ??= true;
    editorConfig.placeholder ??= '';
    editorConfig.defaultParagraphSeparator ??= '';
    editorConfig.defaultFontName ??= 'Arial';
    editorConfig.defaultFontSize ??= '2';
    editorConfig.fonts ??= [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' }
    ];
    editorConfig.sanitize ??= true;
    editorConfig.toolbarPosition ??= 'top';
    editorConfig.outline ??= true;
    editorConfig.toolbarHiddenButtons ??= {};

    return <AngularEditorConfig>editorConfig;
}
