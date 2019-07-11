import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

describe('AngularEditorComponent', () => {
  let component: AngularEditorComponent;
  let fixture: ComponentFixture<AngularEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule ],
      declarations: [AngularEditorComponent, AngularEditorToolbarComponent, ]
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
