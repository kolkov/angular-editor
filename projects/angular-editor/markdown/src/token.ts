// Re-export from core for published package (@kolkov/angular-editor)
// In dev mode, tsconfig paths resolve @kolkov/angular-editor to dist/
// which creates a different token instance than the source.
// We export both to ensure token identity in all environments.
export { AE_MARKDOWN_CONVERTER } from '@kolkov/angular-editor';
export type { MarkdownConverter } from '@kolkov/angular-editor';
