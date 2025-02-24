import {
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../types';
import { OverlayModule } from '@angular/cdk/overlay';

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
    imports: [CommonModule, OverlayModule],
    standalone: true
})
export class AeSelectComponent implements ControlValueAccessor {
    /**
     * The title of the select component.
     */
    @Input()
    public title!: string;

    /**
     * The options available for selection.
     */
    @Input()
    public options: SelectOption[] = [];

    /**
     * Whether the select component is hidden.
     */
    @Input('hidden')
    public isHidden?: boolean;

    /**
     * Event emitted when the selected option changes.
     */
    @Output('change')
    public changeEvent = new EventEmitter();

    /**
     * The currently selected option.
     */
    public selectedOption?: SelectOption;

    /**
     * Whether the select component is disabled.
     */
    public disabled = false;

    /**
     * The ID of the currently selected option.
     */
    public optionId = 0;

    /**
     * Whether the select dropdown is open.
     */
    public isOpen = false;

    constructor() {}

    /**
     * Gets the label of the selected option.
     */
    public get label(): string {
        return this.selectedOption &&
            this.selectedOption.hasOwnProperty('label')
            ? this.selectedOption.label
            : 'Select';
    }

    /**
     * Gets the value of the selected option.
     */
    public get value(): string | undefined {
        return this.selectedOption?.value;
    }

    /**
     * Handles the click event on the select component.
     * @param event The click event.
     * @param cdkOverlay The overlay element.
     */
    public onClicked(event: any, cdkOverlay?: any) {
        console.log(cdkOverlay);
        console.log(event);
    }

    /**
     * Writes a value to the select component.
     * @param value The value to write.
     */
    public writeValue(value: unknown) {
        if (!value || typeof value !== 'string') {
            return;
        }
        this.setValue(value);
    }

    /**
     * Sets the value of the select component.
     * @param value The value to set.
     */
    private setValue(value: unknown) {
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

    public onChange: any = () => {};
    public onTouched: any = () => {};

    /**
     * Registers a callback function to be called when the value changes.
     * @param fn The callback function.
     */
    public registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    /**
     * Registers a callback function to be called when the component is touched.
     * @param fn The callback function.
     */
    public registerOnTouched(fn: Function) {
        this.onTouched = fn;
    }

    /**
     * Selects an option.
     * @param option The option to select.
     * @param event The event that triggered the selection.
     */
    public optionSelect(
        option: SelectOption,
        event?: MouseEvent | KeyboardEvent
    ) {
        if (!event) {
            this._select(option);
            return;
        }

        if (event instanceof MouseEvent) {
            if (event.buttons === 1) {
                event.preventDefault();
                event.stopPropagation();
                this._select(option);
            }

            return;
        }

        if (event.key !== 'Enter' && event.key !== 'Space') return;

        event.preventDefault();
        event.stopPropagation();
        this._select(option);
    }

    /**
     * Internal method to select an option.
     * @param option The option to select.
     */
    private _select(option: SelectOption) {
        this.setValue(option.value);
        this.onChange(this.selectedOption?.value);
        this.changeEvent.emit(this.selectedOption?.value);
        this.onTouched();
        this.isOpen = false;
    }
}
