import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'ae-toolbar-set, [aeToolbarSet]',
    templateUrl: './ae-toolbar-set.component.html',
    styleUrls: ['./ae-toolbar-set.component.scss'],
    //encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'angular-editor-toolbar-set'
    },
    standalone: false
})
export class AeToolbarSetComponent {

  constructor() {
  }

}
