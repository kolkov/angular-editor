import { AngularEditorConfig as _AngularEditorConfig } from './lib/config';

export * from './lib/angular-editor.service';
export * from './lib/angular-editor.component';
export * from './lib/ae-button/ae-button.component';
export * from './lib/ae-toolbar-set/ae-toolbar-set.component';
export * from './lib/ae-select/ae-select.component';
export * from './lib/ae-toolbar/ae-toolbar.component';
export * from './lib/ae-selection.service';

export { provideAngularEditor } from './lib/provide-angluar-editor';

export {
    type CustomClass,
    type Font,
    type HiddenButtons,
    type EditOptions,
    type FontOptions,
    type MediaOptions,
    type SpecialFormats,
    type StyleOptions,
    type TextAlignOptions
} from './lib/config';

export declare type AngularEditorConfig = Partial<_AngularEditorConfig>;
