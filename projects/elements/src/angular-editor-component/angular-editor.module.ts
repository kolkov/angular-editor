import {Injector, NgModule} from '@angular/core';
import {ElementModule} from '../abstract/element.module';
import {AngularEditorComponent, AngularEditorModule} from '../../../angular-editor/src/public-api';
import {BrowserModule} from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';
import {HelloWorldModule} from '../hello-world/hello-world.module';
import {HelloWorldComponent} from '../hello-world/hello-world.component';

@NgModule({
  imports: [BrowserModule, AngularEditorModule, HelloWorldModule],
  entryComponents: [AngularEditorComponent, HelloWorldComponent],
})
export class AngularEditorElementModule {
  /*constructor(injector: Injector) {
    super(injector, AngularEditorComponent, 'angular-editor');
  }*/

  constructor(injector: Injector) {
    const custom = createCustomElement(AngularEditorComponent, {injector: injector});
    customElements.define('angular-editor', custom);

    const custom2 = createCustomElement(AngularEditorComponent, {injector: injector});
    customElements.define('app-hello-world', custom2);
  }
  ngDoBootstrap() {}
}
