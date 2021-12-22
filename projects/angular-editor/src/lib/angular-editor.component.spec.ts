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

  it('should paste raw text', () => {
    const htmlText = '<h1>Hello!</h1>';
    const rawText = 'Hello!';
    component.config.rawPaste = true;

    const dataTransfer = new DataTransfer();

    const clipboardEvent = new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
    });
    clipboardEvent.clipboardData.setData("text/plain", rawText);
    clipboardEvent.clipboardData.setData("text/html", htmlText);

    const outputRawText = component.onPaste(clipboardEvent);

    expect(outputRawText).toEqual(rawText);
  });
});
