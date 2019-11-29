import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AngularEditorElementModule } from './angular-editor-component/angular-editor.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AngularEditorElementModule)
  .catch(err => console.error(err));
