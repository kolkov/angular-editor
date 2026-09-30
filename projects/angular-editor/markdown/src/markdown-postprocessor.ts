export function postprocessMarkdown(markdown: string): string {
  if (!markdown) {
    return '';
  }

  let result = markdown;

  // Trim trailing whitespace from each line
  result = result.replace(/[ \t]+$/gm, '');

  // Normalize line endings
  result = result.replace(/\r\n/g, '\n');

  // Collapse 3+ consecutive blank lines into 2
  result = result.replace(/\n{3,}/g, '\n\n');

  // Ensure single trailing newline
  result = result.trimEnd() + '\n';

  // But if result is only whitespace, return empty
  if (result.trim() === '') {
    return '';
  }

  return result;
}
