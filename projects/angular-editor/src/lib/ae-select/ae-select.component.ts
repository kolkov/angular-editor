import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isDefined } from '../utils';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { SelectOption } from '../types';

@Component({
    selector: 'ae-select',
    templateUrl: './ae-select.component.html',
    styleUrls: ['./ae-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AeSelectComponent),
            multi: true
        }
    ],
    imports: [CommonModule, MatSelectModule],
    standalone: true
})
export class AeSelectComponent implements OnInit, ControlValueAccessor {
    @Input()
    title!: string;

    @Input()
    options: SelectOption[] = [];

    @Input('hidden')
    isHidden?: boolean;

    selectedOption?: SelectOption;
    disabled = false;
    optionId = 0;

    get label(): string {
        return this.selectedOption &&
            this.selectedOption.hasOwnProperty('label')
            ? this.selectedOption.label
            : 'Select';
    }

    isOpen = false;

    get value(): string | undefined {
        return this.selectedOption?.value;
    }

    // @HostBinding('style.display')
    // hidden = 'inline-block';

    @Output('change')
    changeEvent = new EventEmitter();

    @ViewChild('labelButton', { static: true })
    labelButton?: ElementRef;

    constructor(
        private elRef: ElementRef,
        private r: Renderer2
    ) {}

    ngOnInit() {
        this.selectedOption = this.options[0];
        if (isDefined(this.isHidden) && this.isHidden) {
            // this.hide();
        }
    }

    writeValue(value: unknown) {
        if (!value || typeof value !== 'string') {
            return;
        }
        this.setValue(value);
    }

    setValue(value: unknown) {
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

    onChange: any = () => {};
    onTouched: any = () => {};

    registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onTouched = fn;
    }

    // hide() {
    //     this.hidden = 'none';
    // }

    optionSelect(option: SelectOption) {
        //, event: MouseEvent | KeyboardEvent) {
        if ((<any>event).buttons !== 1) {
            // @todo - TS error
            return;
        }
        // event.preventDefault();
        // event.stopPropagation();
        this.setValue(option.value);
        this.onChange(this.selectedOption?.value);
        this.changeEvent.emit(this.selectedOption?.value);
        this.onTouched();
        this.isOpen = false;
    }

    toggleOpen(event: MouseEvent) {
        // event.stopPropagation();
        if (this.disabled) {
            return;
        }
        this.isOpen = !this.isOpen;
    }

    @HostListener('document:click', ['$event'])
    onClick($event: MouseEvent) {
        if (!this.elRef.nativeElement.contains($event.target)) {
            this.close();
        }
    }

    close() {
        this.isOpen = false;
    }

    // setDisabledState(isDisabled: boolean): void {
    //     if (!this.labelButton) return;
    //     this.labelButton.nativeElement.disabled = isDisabled;
    //     const div = this.labelButton.nativeElement;
    //     const action = isDisabled ? 'addClass' : 'removeClass';
    //     this.r[action](div, 'disabled');
    //     this.disabled = isDisabled;
    // }

    // @HostListener('keydown', ['$event'])
    // handleKeyDown($event: KeyboardEvent) {
    //     if (!this.opened) {
    //         return;
    //     }
    //     // console.log($event.key);
    //     // if (KeyCode[$event.key]) {
    //     switch ($event.key) {
    //         case 'ArrowDown':
    //             this._handleArrowDown($event);
    //             break;
    //         case 'ArrowUp':
    //             this._handleArrowUp($event);
    //             break;
    //         case 'Space':
    //             this._handleSpace($event);
    //             break;
    //         case 'Enter':
    //             this._handleEnter($event);
    //             break;
    //         case 'Tab':
    //             this._handleTab($event);
    //             break;
    //         case 'Escape':
    //             this.close();
    //             $event.preventDefault();
    //             break;
    //         case 'Backspace':
    //             this._handleBackspace();
    //             break;
    //     }
    //     // } else if ($event.key && $event.key.length === 1) {
    //     // this._keyPress$.next($event.key.toLocaleLowerCase());
    //     // }
    // }

    // _handleArrowDown($event: unknown) {
    //     if (this.optionId < this.options.length - 1) {
    //         this.optionId++;
    //     }
    // }

    // _handleArrowUp($event: unknown) {
    //     if (this.optionId >= 1) {
    //         this.optionId--;
    //     }
    // }

    // _handleSpace($event: unknown) {}

    // _handleEnter($event: KeyboardEvent) {
    //     this.optionSelect(this.options[this.optionId], $event);
    // }

    // _handleTab($event: unknown) {}

    // _handleBackspace() {}
}
