import { Provider } from '@angular/core';
import { AngularEditorConfig } from './config';
import { loadDefaultConfig } from './config-default';
import { AeSelectionService } from './ae-selection.service';

export const NGX_EDITOR_CONFIG = 'NGX_EDITOR_CONFIG';

export function provideAngularEditor(
    editorConfig: Partial<AngularEditorConfig>
): Provider[] {
    return [
        {
            provide: NGX_EDITOR_CONFIG,
            useValue: loadDefaultConfig(editorConfig)
        },
        AeSelectionService
    ];
}
