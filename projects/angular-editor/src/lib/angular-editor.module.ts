import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AeSelectComponent } from './ae-select/ae-select.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faItalic, faBold, faSuperscript, faSubscript, faUnderline, faUndo, faAlignCenter, faAlignLeft, faAlignJustify, faAlignRight, faRedo, faStrikethrough, faIndent, faOutdent, faListOl, faListUl, faFont, faLink, faUnlink, faImage, faVideo, faMinus, faCode, faRemoveFormat } from '@fortawesome/free-solid-svg-icons';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,FontAwesomeModule,NgbPaginationModule, NgbAlertModule
  ],
  declarations: [AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent,],
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
