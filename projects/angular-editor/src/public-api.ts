/*
 * Public API Surface of angular-editor
 */

export * from './lib/angular-editor.service';
export * from './lib/editor/angular-editor.component';
export * from './lib/ae-button/ae-button.component';
export * from './lib/ae-toolbar-set/ae-toolbar-set.component';
export * from './lib/ae-select/ae-select.component';
export * from './lib/ae-toolbar/ae-toolbar.component';
export * from './lib/angular-editor.module';
export type { AngularEditorConfig, CustomClass, EditorFormattingState, AeSanitizeFn, MarkdownConverter } from './lib/config';
export { DEFAULT_FORMATTING_STATE, TOGGLE_COMMANDS, BLOCK_TAGS, AE_SANITIZER, provideEditorSanitizer, AE_MARKDOWN_CONVERTER } from './lib/config';
