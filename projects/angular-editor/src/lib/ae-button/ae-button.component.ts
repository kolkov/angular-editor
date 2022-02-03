import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'ae-button',
  templateUrl: './ae-button.component.html',
  styleUrls: ['./ae-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AeButtonComponent {

  @Input() id = '';
  @Input() title = '';
  @Input() disabled = false;
  @Input() iconClass = '';
  @Output() buttonClick = new EventEmitter();

  constructor() { }

}
