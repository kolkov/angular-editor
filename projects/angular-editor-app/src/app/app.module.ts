import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AngularEditorModule} from '../../../angular-editor/src/lib/angular-editor.module';
import {provideEditorSanitizer, AE_MARKDOWN_CONVERTER} from '../../../angular-editor/src/lib/config';
import {DefaultMarkdownConverter} from '../../../angular-editor/markdown/src/default-markdown-converter';
import {TurndownAdapter} from '../../../angular-editor/markdown/src/adapters/turndown-adapter';
import {MarkedAdapter} from '../../../angular-editor/markdown/src/adapters/marked-adapter';
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
    {
      provide: AE_MARKDOWN_CONVERTER,
      useFactory: () => new DefaultMarkdownConverter(
        new TurndownAdapter(),
        new MarkedAdapter(),
      ),
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
