import { Provider } from '@angular/core';
import { AE_MARKDOWN_CONVERTER } from './token';
import { DefaultMarkdownConverter } from './default-markdown-converter';
import { TurndownAdapter } from './adapters/turndown-adapter';
import { MarkedAdapter } from './adapters/marked-adapter';
import { MarkdownConversionConfig, DEFAULT_CONVERSION_CONFIG } from './types';

export function provideMarkdownConverter(config?: MarkdownConversionConfig): Provider {
  return {
    provide: AE_MARKDOWN_CONVERTER,
    useFactory: () => {
      const mergedConfig = { ...DEFAULT_CONVERSION_CONFIG, ...config };
      return new DefaultMarkdownConverter(
        new TurndownAdapter(mergedConfig),
        new MarkedAdapter(mergedConfig),
        mergedConfig,
      );
    },
  };
}
