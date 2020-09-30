import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faCode, faFont, faImage, faIndent, faItalic, faLink, faListOl, faListUl, faMinus, faOutdent, faRedo, faRemoveFormat, faStrikethrough, faSubscript, faSuperscript, faUnderline, faUndo, faUnlink, faVideo } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AeSelectComponent } from './ae-select/ae-select.component';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';
import { AngularEditorComponent } from './angular-editor.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, NgbDropdownModule
  ],
  declarations: [AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent],
  exports: [AngularEditorComponent, AngularEditorToolbarComponent]
})
export class AngularEditorModule {
  constructor(library: FaIconLibrary) {

    library.addIcons(
      faItalic,
      faBold,
      faSuperscript,
      faSubscript,
      faUnderline,
      faUndo,
      faAlignRight,
      faAlignCenter,
      faAlignLeft,
      faAlignJustify,
      faRedo,
      faStrikethrough,
      faIndent,
      faOutdent,
      faListUl,
      faListOl,
      faFont,
      faLink,
      faUnlink,
      faImage,
      faVideo,
      faMinus,
      faRemoveFormat,
      faCode

    );
  }
}
