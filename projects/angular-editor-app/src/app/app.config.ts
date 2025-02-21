import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEditorConfig } from '@angular-elements/rich-text-editor';
import { editorConfig } from './editor.config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        provideEditorConfig(editorConfig)
    ]
};
