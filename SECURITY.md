# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| < 3.0   | :x:                |

## Reporting a Vulnerability

To report a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to the maintainers via GitHub private vulnerability reporting
3. Or open a private security advisory at: https://github.com/kolkov/angular-editor/security/advisories/new

We will respond within 48 hours and work with you to understand and address the issue.

## Security Considerations

angular-editor is a WYSIWYG rich text editor that handles user-generated HTML content. Security considerations include:

- **XSS prevention**: DomSanitizer is enabled by default (`sanitize: true` in config)
- **Content sanitization**: All HTML input is sanitized before rendering
- **execCommand API**: The editor uses the browser's native `document.execCommand()` for text formatting
- **Image uploads**: When using custom upload functions, ensure server-side validation

## Disclosure Policy

We follow responsible disclosure practices:

1. Reporter notifies us privately
2. We acknowledge and investigate
3. We develop and test a fix
4. We release the fix and credit the reporter (if desired)
5. We publish a security advisory
