import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ae-button, button[aeButton]',
  templateUrl: './ae-button.component.html',
  styleUrls: ['./ae-button.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'angular-editor-button',
    '[tabIndex]': '-1',
    '[type]': '"button"',
  }
})
export class AeButtonComponent {

  @Input() iconName = '';

  constructor() {
  }

}
