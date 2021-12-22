import {
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isDefined} from '../utils';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ae-select',
  templateUrl: './ae-select.component.html',
  styleUrls: ['./ae-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AeSelectComponent),
      multi: true,
    }
  ]
})
export class AeSelectComponent implements OnInit, ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('hidden') isHidden: boolean;

  selectedOption: SelectOption;
  disabled = false;
  optionId = 0;

  get label(): string {
    return this.selectedOption && this.selectedOption.hasOwnProperty('label') ? this.selectedOption.label : 'Select';
  }

  opened = false;

  get value(): string {
    return this.selectedOption.value;
  }

  @HostBinding('style.display') hidden = 'inline-block';

  // eslint-disable-next-line @angular-eslint/no-output-native, @angular-eslint/no-output-rename
  @Output('change') changeEvent = new EventEmitter();

  @ViewChild('labelButton', {static: true}) labelButton: ElementRef;

  constructor(private elRef: ElementRef,
              private r: Renderer2,
  ) {}

  ngOnInit() {
    this.selectedOption = this.options[0];
    if (isDefined(this.isHidden) && this.isHidden) {
      this.hide();
    }
  }

  hide() {
    this.hidden = 'none';
  }

  optionSelect(option: SelectOption, event: MouseEvent) {
    event.stopPropagation();
    this.setValue(option.value);
    this.onChange(this.selectedOption.value);
    this.changeEvent.emit(this.selectedOption.value);
    this.onTouched();
    this.opened = false;
  }

  toggleOpen(event: MouseEvent) {
    // event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
  }

  @HostListener('document:click', ['$event'])
  onClick($event: MouseEvent) {
    if (!this.elRef.nativeElement.contains($event.target)) {
      this.close();
    }
  }

  close() {
    this.opened = false;
  }

  get isOpen(): boolean {
    return this.opened;
  }

  writeValue(value) {
    if (!value || typeof value !== 'string') {
      return;
    }
    this.setValue(value);
  }

  setValue(value) {
    let index = 0;
    const selectedEl = this.options.find((el, i) => {
      index = i;
      return el.value === value;
    });
    if (selectedEl) {
      this.selectedOption = selectedEl;
      this.optionId = index;
    }
  }

  onChange: any = () => {
  }
  onTouched: any = () => {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.labelButton.nativeElement.disabled = isDisabled;
    const div = this.labelButton.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if (!this.opened) {
      return;
    }
    // console.log($event.key);
    // if (KeyCode[$event.key]) {
    switch ($event.key) {
      case 'ArrowDown':
        this._handleArrowDown($event);
        break;
      case 'ArrowUp':
        this._handleArrowUp($event);
        break;
      case 'Space':
        this._handleSpace($event);
        break;
      case 'Enter':
        this._handleEnter($event);
        break;
      case 'Tab':
        this._handleTab($event);
        break;
      case 'Escape':
        this.close();
        $event.preventDefault();
        break;
      case 'Backspace':
        this._handleBackspace();
        break;
    }
    // } else if ($event.key && $event.key.length === 1) {
    // this._keyPress$.next($event.key.toLocaleLowerCase());
    // }
  }

  _handleArrowDown($event) {
    if (this.optionId < this.options.length - 1) {
      this.optionId++;
    }
  }

  _handleArrowUp($event) {
    if (this.optionId >= 1) {
      this.optionId--;
    }
  }

  _handleSpace($event) {

  }

  _handleEnter($event) {
    this.optionSelect(this.options[this.optionId], $event);
  }

  _handleTab($event) {

  }

  _handleBackspace() {

  }
}
