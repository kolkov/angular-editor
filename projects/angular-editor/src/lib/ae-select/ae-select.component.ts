import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
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
    //encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AeSelectComponent),
            multi: true,
        }
    ],
    standalone: false
})
export class AeSelectComponent implements OnInit, ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('hidden') isHidden: boolean = false;

  selectedOption!: SelectOption;
  disabled = false;
  optionId = 0;

  get label(): string {
    return this.selectedOption && Object.prototype.hasOwnProperty.call(this.selectedOption, 'label') ? this.selectedOption.label : 'Select';
  }

  opened = false;

  get value(): string {
    return this.selectedOption.value;
  }

  @HostBinding('style.display') hidden = 'inline-block';

  // eslint-disable-next-line @angular-eslint/no-output-native, @angular-eslint/no-output-rename
  @Output('change') changeEvent = new EventEmitter();

  @ViewChild('labelButton', {static: true}) labelButton!: ElementRef;

  private elRef = inject(ElementRef);
  private r = inject(Renderer2);

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
    //console.log(event.button, event.buttons);
    if (event.buttons !== 1) {
      return;
    }
    event.preventDefault();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any) {
    if (!value || typeof value !== 'string') {
      return;
    }
    this.setValue(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue(value: any) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTouched: any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleArrowDown($event: any) {
    if (this.optionId < this.options.length - 1) {
      this.optionId++;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleArrowUp($event: any) {
    if (this.optionId >= 1) {
      this.optionId--;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleSpace($event: any) {

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleEnter($event: any) {
    this.optionSelect(this.options[this.optionId], $event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleTab($event: any) {

  }

  _handleBackspace() {

  }
}
