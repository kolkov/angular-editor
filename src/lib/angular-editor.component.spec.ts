import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularEditorComponent } from './angular-editor.component';

describe('AngularEditorComponent', () => {
  let component: AngularEditorComponent;
  let fixture: ComponentFixture<AngularEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularEditorComponent ]
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
