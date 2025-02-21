import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ae-button, button[aeButton]',
    templateUrl: './ae-button.component.html',
    styleUrls: ['./ae-button.component.scss'],
    host: {
        class: 'angular-editor-button',
        '[tabIndex]': '-1',
        '[type]': '"button"'
    },
    imports: [CommonModule],
    standalone: true
})
export class AeButtonComponent {
    @Input() iconName = '';

    constructor() {}
}
