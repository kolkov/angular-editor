import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from 'angular-editor';

const ANGULAR_EDITOR_LOGO_URL = 'https://raw.githubusercontent.com/kolkov/angular-editor/master/docs/angular-editor-logo.png?raw=true'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  form: UntypedFormGroup;

  htmlContent1 = '';
  htmlContent2 = '';
  angularEditorLogo = `<img alt="angular editor logo" src="${ANGULAR_EDITOR_LOGO_URL}">`;

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    // toolbarPosition: 'top',
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    // showToolbar: false,
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  config2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: true,
    toolbarPosition: 'bottom',
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    console.log(this.htmlContent1);
  }

  onChange(event) {
    console.log('changed');
  }

  onBlur(event) {
    console.log('blur ' + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }
}
