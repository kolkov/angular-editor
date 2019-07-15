# AngularEditor
[![npm version](https://badge.fury.io/js/%40kolkov%2Fangular-editor.svg)](https://badge.fury.io/js/%40kolkov%2Fangular-editor)
[![demo](https://img.shields.io/badge/demo-StackBlitz-blueviolet.svg)](https://stackblitz.com/edit/angular-editor-wysiwyg)
[![Build Status](https://travis-ci.com/kolkov/angular-editor.svg?branch=master)](https://travis-ci.com/kolkov/angular-editor)
[![npm](https://img.shields.io/npm/dw/@kolkov/angular-editor.svg)](https://www.npmjs.com/package/@kolkov/angular-editor)
[![](https://data.jsdelivr.com/v1/package/npm/@kolkov/angular-editor/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@kolkov/angular-editor)
[![Coverage Status](https://coveralls.io/repos/github/kolkov/angular-editor/badge.svg?branch=master)](https://coveralls.io/github/kolkov/angular-editor?branch=master)
[![dependencies Status](https://david-dm.org/kolkov/angular-editor/status.svg)](https://david-dm.org/kolkov/angular-editor)
[![devDependencies Status](https://david-dm.org/kolkov/angular-editor/dev-status.svg)](https://david-dm.org/kolkov/angular-editor?type=dev)
[![codecov](https://codecov.io/gh/kolkov/angular-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/kolkov/angular-editor)

A simple native WYSIWYG editor for Angular 6+, 7+, 8+

## Demo
Demo is here [demo][demo]

Working code for this demo at stackblitz [example](https://stackblitz.com/edit/angular-editor-wysiwyg)

## Getting Started

### Installation

Install via [npm][npm] package manager 

```bash
npm install @kolkov/angular-editor --save
```

### Usage

Import `angular-editor` module

```typescript
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [ HttpClientModule, AngularEditorModule ]
})
```

Then in HTML

```html
<angular-editor [placeholder]="'Enter text here...'" [(ngModel)]="htmlContent"></angular-editor>
```

or for usage with reactive forms

```html
<angular-editor formControlName="htmlContent" [config]="editorConfig"></angular-editor>
```

if you using more than one editor on same page set `id` property

```html
<angular-editor id="editor1" formControlName="htmlContent1" [config]="editorConfig"></angular-editor>
<angular-editor id="editor2" formControlName="htmlContent2" [config]="editorConfig"></angular-editor>

```

where

```typescript
import { AngularEditorConfig } from '@kolkov/angular-editor';

...

config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
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
```

For `ngModel` to work, you must import `FormsModule` from `@angular/forms`, or for `formControlName`, you must import `ReactiveFormsModule` from `@angular/forms`

## What's included

Within the download you'll find the following directories and files. You'll see something like this:

```
angular-editor/
└── projects/
    ├── angular-editor/
    └── angular-editor-app/
```
`angular-editor/` - library

`angular-editor-app/` - demo application

## Documentation

The documentation for the AngularEditor is hosted at our website [AngularEditor](https://angular-editor.kolkov.ru/)

## Contributing

Please read through our [contributing guidelines](https://github.com/kolkov/angular-editor/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Editor preferences are available in the [editor config](https://github.com/kolkov/angular-editor/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, AngularEditor is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/kolkov/angular-editor/releases) for changelogs for each release version.

## Creators

**Andrey Kolkov**

* <https://github.com/kolkov>

[npm]: https://www.npmjs.com/
[demo]: https://angular-editor-wysiwyg.stackblitz.io/
[example]: https://stackblitz.com/edit/angular-editor-wysiwyg
