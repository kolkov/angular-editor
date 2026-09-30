import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AngularEditorModule} from '../../../angular-editor/src/lib/angular-editor.module';
import {provideEditorSanitizer} from '../../../angular-editor/src/lib/config';
import DOMPurify from 'dompurify';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularEditorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideEditorSanitizer((html) => DOMPurify.sanitize(html)),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
