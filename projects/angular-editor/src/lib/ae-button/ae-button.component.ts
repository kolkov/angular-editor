import {Component, Input} from '@angular/core';

@Component({
    selector: 'ae-button, button[aeButton]',
    templateUrl: './ae-button.component.html',
    styleUrls: ['./ae-button.component.scss'],
    host: {
        'class': 'angular-editor-button',
        '[attr.tabIndex]': '-1',
        '[attr.type]': '"button"',
    },
    standalone: false
})
export class AeButtonComponent {

  @Input() iconName = '';

}
