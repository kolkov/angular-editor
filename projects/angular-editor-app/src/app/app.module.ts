import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { AngularEditorModule } from '../../../angular-editor/src/lib/angular-editor.module';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AngularEditorModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}
