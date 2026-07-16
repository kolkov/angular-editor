# AGENTS.md — angular-editor

> Native WYSIWYG/Rich Text editor component for Angular 22+

## What is angular-editor

angular-editor is a native Angular WYSIWYG editor component (`@kolkov/angular-editor` on npm). It provides a rich text editing experience with toolbar customization, image upload, and form integration — all without external dependencies like Font Awesome or jQuery.

## When to use angular-editor

- **You need a rich text editor in Angular** → `<angular-editor [(ngModel)]="content">`
- **You need form integration** → works with both Template-driven and Reactive forms
- **You need toolbar customization** → configure via `AngularEditorConfig` or add custom buttons
- **You need image upload** → built-in HTTP upload or custom upload function

**You DON'T need angular-editor if** you need a full document editor (use ProseMirror/TipTap) or a code editor (use Monaco).

## Quick Start

```typescript
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  imports: [AngularEditorModule],
  template: `<angular-editor [(ngModel)]="htmlContent" [config]="editorConfig">`
})
export class MyComponent {
  htmlContent = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    toolbarPosition: 'top',
  };
}
```

### Assets setup (angular.json)

```json
{
  "glob": "**/*",
  "input": "node_modules/@kolkov/angular-editor/assets/icons",
  "output": "assets/ae-icons/"
}
```

## Architecture

```
projects/angular-editor/src/lib/
  ├── editor/          # Main AngularEditorComponent (ControlValueAccessor)
  ├── ae-toolbar/      # Toolbar with formatting buttons
  ├── ae-select/       # Custom select dropdown (fonts, sizes, etc.)
  ├── ae-button/       # Toolbar button component
  ├── ae-toolbar-set/  # Toolbar button grouping
  ├── angular-editor.service.ts  # Core service (execCommand wrapper)
  └── config.ts        # AngularEditorConfig interface and defaults
```

### Key packages

| Component | Purpose |
|-----------|---------|
| `AngularEditorComponent` | Main editor — contenteditable div with ngModel support |
| `AngularEditorService` | Wraps `document.execCommand()` for formatting operations |
| `AeToolbarComponent` | Configurable toolbar with built-in and custom buttons |
| `AeSelectComponent` | Custom dropdown for font family, size, heading, etc. |
| `AngularEditorConfig` | Configuration interface — fonts, buttons, upload, sanitization |

## Current Version

v3.1.0 | Angular 22+ | TypeScript 6.0 | Vitest

## Build & Test

```bash
npm install
npm start                       # Demo app with hot reload
npm run build-prod:lib          # Production library build
npm run test:lib                # Run Vitest tests
npm run test-ci                 # Tests with coverage (CI mode)
npm run lint:lib                # ESLint (flat config)
```

## Custom Buttons

```html
<angular-editor [(ngModel)]="content" [config]="config">
  <ng-template #customButtons let-executeCommandFn="executeCommandFn">
    <ae-toolbar-set>
      <button aeButton (click)="executeCommandFn('insertHtml', myHtml)">
        Custom
      </button>
    </ae-toolbar-set>
  </ng-template>
</angular-editor>
```

## CSS Variable Theming

```scss
@import "node_modules/@kolkov/angular-editor/themes/default.scss";

:root {
  --ae-toolbar-bg-color: #f5f5f5;
  --ae-button-hover-bg-color: #e0e0e0;
  --ae-text-area-border: 1px solid #ddd;
}
```

## Links

- GitHub: https://github.com/kolkov/angular-editor
- npm: https://www.npmjs.com/package/@kolkov/angular-editor
- Demo: https://stackblitz.com/edit/angular-editor-wysiwyg
