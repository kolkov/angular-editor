import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AeButtonComponent } from "./ae-button/ae-button.component";
import { AeSelectComponent } from './ae-select/ae-select.component';
import { AeToolbarSetComponent } from './ae-toolbar-set/ae-toolbar-set.component';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';
import { AngularEditorComponent } from './angular-editor.component';

import { fab, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule
  ],
  declarations: [AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent, AeButtonComponent, AeToolbarSetComponent],
  exports: [AngularEditorComponent, AngularEditorToolbarComponent, AeButtonComponent, AeToolbarSetComponent]
})
export class AngularEditorModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab);
}
}


