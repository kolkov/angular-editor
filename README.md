# AngularEditor
A simple native wysiwyg editor for Angular 6+, 7+

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

editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
```

For `ngModel` to work, you must import `FormsModule` from `@angular/forms`, or for `formControlName`, you must import `ReactiveFormsModule` from `@angular/forms`

[npm]: https://www.npmjs.com/
[demo]: https://angular-editor-wysiwyg.stackblitz.io/
[example]: https://stackblitz.com/edit/angular-editor-wysiwyg
