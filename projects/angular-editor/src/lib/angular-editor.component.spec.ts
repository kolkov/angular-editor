import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {AngularEditorModule} from './angular-editor.module';

describe('AngularEditorComponent', () => {
  let component: AngularEditorComponent;
  let fixture: ComponentFixture<AngularEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule],
      declarations: [AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
