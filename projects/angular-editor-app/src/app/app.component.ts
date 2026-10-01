import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

const ANGULAR_EDITOR_LOGO_URL = 'https://raw.githubusercontent.com/kolkov/angular-editor/master/docs/angular-editor-logo.png?raw=true'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'app';

  form!: FormGroup;

  htmlContent1 = '';
  markdownContent = '# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n';
  markdownOutput = '';
  angularEditorLogo = `<img alt="angular editor logo" src="${ANGULAR_EDITOR_LOGO_URL}">`;

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {name: 'quote', class: 'quote'},
      {name: 'redText', class: 'redText'},
      {name: 'titleText', class: 'titleText', tag: 'h1'},
    ],
    toolbarHiddenButtons: [['bold', 'italic']],
    textDirection: 'auto'
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
      {name: 'quote', class: 'quote'},
      {name: 'redText', class: 'redText'},
      {name: 'titleText', class: 'titleText', tag: 'h1'},
    ]
  };

  configMarkdown: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Type here — try pasting Markdown!',
    translate: 'no',
    sanitize: true,
    outputFormat: 'markdown',
    pasteMarkdown: true,
    defaultParagraphSeparator: 'p',
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange(event: any) {
    console.log('changed');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur(event: any) {
    console.log('blur ' + event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange2(event: any) {
    console.warn(this.form.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContentChanged(event: any) {
    this.markdownOutput = event.markdown || '';
  }
}
