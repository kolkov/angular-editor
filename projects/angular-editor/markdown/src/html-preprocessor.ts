export function preprocessHtml(html: string): string {
  if (!html || html === '<br>' || html.trim() === '') {
    return '';
  }

  let result = html;

  // Normalize &nbsp; to regular space
  result = result.replace(/&nbsp;/g, ' ');

  // Remove zero-width spaces
  result = result.replace(/[\u200B\uFEFF]/g, '');

  // Normalize <br> variants
  result = result.replace(/<br\s*\/?>/gi, '<br>');

  // Remove empty spans (execCommand artifacts)
  result = result.replace(/<span[^>]*>\s*<\/span>/gi, '');

  // Remove font tags but keep content (legacy execCommand output)
  result = result.replace(/<\/?font[^>]*>/gi, '');

  // Collapse multiple consecutive <br> into paragraph breaks
  result = result.replace(/(<br>\s*){3,}/gi, '<br><br>');

  return result.trim();
}
