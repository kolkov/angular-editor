# Contributing to AngularEditor

We welcome contributions! Here's how to get started.

## Report an Issue

Before creating a new issue, [search existing issues](https://github.com/kolkov/angular-editor/issues) to see if it's already been reported.

If not, [create a new issue](https://github.com/kolkov/angular-editor/issues/new) with:
- A clear description of the problem
- Steps to reproduce
- A minimal reproduction (e.g., [StackBlitz](https://stackblitz.com/edit/angular-editor-wysiwyg))

**Note**: If you're unsure how a feature works, ask on [StackOverflow](http://stackoverflow.com/questions/ask?tags=angular,@kolkov/angular-editor) first.

## Contribute Code

1. Fork the repository and create a feature branch
2. Follow the [development setup](#developing) below
3. Write tests for new features or bug fixes
4. Follow the [Angular commit message format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
5. Open a pull request

### Commit Messages

```
<type>: <subject>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Code Guidelines

- Always have test coverage for new features
- Never break existing tests
- Follow the existing code style
- Squash commits before merging

## Developing

### Prerequisites

- Node.js 24+
- npm 11+

### Setup

```bash
git clone https://github.com/kolkov/angular-editor.git
cd angular-editor
npm install
```

### Development Workflow

```bash
# Terminal 1: Watch and rebuild library on changes
npm run build-watch:lib

# Terminal 2: Run demo app
npm start
```

### Testing

```bash
npm run test:lib        # Run library tests (Vitest)
npm run test-ci         # Tests with coverage
npm run lint:lib        # ESLint
```

### Building

```bash
npm run build-prod:lib  # Production library build
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
