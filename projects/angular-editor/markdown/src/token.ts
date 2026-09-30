import { InjectionToken } from '@angular/core';
import { MarkdownConverter } from './types';

export const AE_MARKDOWN_CONVERTER = new InjectionToken<MarkdownConverter>(
  'AE_MARKDOWN_CONVERTER'
);
