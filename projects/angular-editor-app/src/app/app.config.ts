import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection
} from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAngularEditor } from '@angular-elements/rich-text-editor';
import { editorConfig } from './editor.config';
import { AeSelectionService } from '@angular-elements/rich-text-editor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        provideAngularEditor(editorConfig),
        importProvidersFrom(AeSelectionService)
    ]
};
