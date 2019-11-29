import {Injector, NgModule} from '@angular/core';
import {ElementModule} from '../abstract/element.module';
import {AngularEditorComponent, AngularEditorModule} from '../../../angular-editor/src/public-api';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule, AngularEditorModule],
  entryComponents: [AngularEditorComponent],
})
export class AngularEditorElementModule extends ElementModule {
  constructor(injector: Injector) {
    super(injector, AngularEditorComponent, 'angular-editor');
  }
}
