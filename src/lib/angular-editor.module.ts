import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from "./angular-editor-toolbar.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    FormsModule, ReactiveFormsModule
  ],
  declarations: [AngularEditorComponent, AngularEditorToolbarComponent],
  exports: [AngularEditorComponent, AngularEditorToolbarComponent]
})
export class AngularEditorModule {
}
