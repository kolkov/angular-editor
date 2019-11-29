import {Injector} from '@angular/core';
import {createCustomElement} from '@angular/elements';

import {PREFIX} from '../prefix';

export abstract class ElementModule {
  constructor(injector: Injector, component: InstanceType<any>, name: string) {
    const ngElement = createCustomElement(component, {
      injector,
    });

    customElements.define(`${PREFIX}-${name}`, ngElement);
  }

  ngDoBootstrap() {}
}
