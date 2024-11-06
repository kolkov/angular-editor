import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'ae-button',
  templateUrl: './ae-button.component.html',
  styleUrls: ['./ae-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AeButtonComponent {

  @Input() icon!: IconDefinition;
  @Input() title = '';
  @Output() buttonClick = new EventEmitter();

  constructor() { }

}
