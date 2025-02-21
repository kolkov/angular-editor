import { CommonModule, DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Attribute,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    Optional,
    Output,
    Renderer2,
    SecurityContext,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AeToolbarComponent } from './ae-toolbar/ae-toolbar.component';
import { AngularEditorService } from './angular-editor.service';
import { AngularEditorConfig } from './config';
import { isDefined } from './utils';
import { BehaviorSubject } from 'rxjs';
import { loadDefaultConfig, NGX_EDITOR_CONFIG } from './provide-editor-config';
import { NgxResizedDirective } from './resized.directive';

@Component({
    selector: 'angular-editor',
    templateUrl: './angular-editor.component.html',
    styleUrls: ['./angular-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AngularEditorComponent),
            multi: true
        },
        AngularEditorService
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AeToolbarComponent,
        NgxResizedDirective
    ],
    standalone: true,
    host: {
        'attr.tabindex': '-1',
        '(focus)': 'onFocus()'
    }
})
export class AngularEditorComponent
    implements ControlValueAccessor, AfterViewInit, OnDestroy
{
    @Input()
    public id = '';

    @Input()
    public placeholder = '';

    @Input()
    public tabIndex?: number | null;

    @Output()
    public sourceMode = new BehaviorSubject<boolean>(true);

    /** emits `blur` event when focused out from the textarea */
    @Output('blur')
    public blurEvent = new EventEmitter<FocusEvent>();

    /** emits `focus` event when focused in to the textarea */
    @Output('focus')
    public focusEvent = new EventEmitter<FocusEvent>();

    @ViewChild('editor', { static: true })
    public textArea!: ElementRef;

    @ViewChild('editorToolbar')
    public editorToolbar!: AeToolbarComponent;

    @ContentChild('customButtons')
    public customButtonsTemplateRef!: TemplateRef<any>;

    private onChange!: (value: string) => void;
    private onTouched!: () => void;

    public showPlaceholder = new BehaviorSubject<boolean>(false);
    public executeCommandFn = this.executeCommand.bind(this);
    public height = new BehaviorSubject<string>('100%');

    public focusInstance: any;
    public blurInstance: any;

    public disabled = false;
    public focused = false;
    public touched = false;
    public changed = false;

    constructor(
        private _renderer: Renderer2,
        private _editorService: AngularEditorService,
        private _sanitizer: DomSanitizer,
        @Optional()
        @Inject(NGX_EDITOR_CONFIG)
        public editorConfig: AngularEditorConfig,
        @Attribute('tabindex') defaultTabIndex: string,
        @Attribute('autofocus') private autoFocus: any
    ) {
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex =
            parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
        this.editorConfig ??= loadDefaultConfig();
    }

    private get _sourceMode() {
        return this.sourceMode.value;
    }
    private set _sourceMode(viewMode: boolean) {
        this.sourceMode.next(viewMode);
    }

    private get _showPlaceholder() {
        return this.showPlaceholder.value;
    }
    private set _showPlaceholder(show: boolean) {
        this.showPlaceholder.next(show);
    }

    ngAfterViewInit() {
        if (isDefined(this.autoFocus)) {
            this.onFocus();
        }
    }

    onPaste(event: ClipboardEvent) {
        if (!this.editorConfig.rawPaste) return;

        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain');
        document.execCommand('insertHTML', false, text);
        return text;
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     * @param value
     */
    executeCommand(command: string, value?: string) {
        this.onFocus();

        if (command === 'focus' || command === '') return;

        switch (command) {
            case 'toggleEditorMode':
                this.toggleEditorMode();
                break;
            case 'clear':
                this._editorService.removeSelectedElements(
                    this.getCustomTags()
                );
                this.onContentChange(this.textArea.nativeElement);
                break;
            case 'default':
                this._editorService.removeSelectedElements(
                    'h1,h2,h3,h4,h5,h6,p,pre'
                );
                this.onContentChange(this.textArea.nativeElement);
                break;
            default:
                this._editorService.executeCommand(command, value);
        }

        this.exec();
    }

    /**
     * focus event
     */
    onTextAreaFocus(event: FocusEvent): void {
        if (this.focused) {
            event.stopPropagation();
            return;
        }
        this.focused = true;
        this.focusEvent.emit(event);
        if (!this.touched || !this.changed) {
            this._editorService.executeInNextQueueIteration(() => {
                this.configure();
                this.touched = true;
            });
        }
    }

    private configure() {
        if (this.editorConfig.defaultParagraphSeparator) {
            this._editorService.setDefaultParagraphSeparator(
                this.editorConfig.defaultParagraphSeparator
            );
        }
        if (this.editorConfig.defaultFontName) {
            this._editorService.setFontName(this.editorConfig.defaultFontName);
        }
        if (this.editorConfig.defaultFontSize) {
            this._editorService.setFontSize(this.editorConfig.defaultFontSize);
        }
    }

    /**
     * @description fires when cursor leaves textarea
     */
    public onTextAreaMouseOut(event: MouseEvent): void {
        this._editorService.saveSelection();
    }

    /**
     * blur event
     */
    onTextAreaBlur(event: FocusEvent) {
        /**
         * save selection if focussed out
         */
        this._editorService.executeInNextQueueIteration(
            this._editorService.saveSelection
        );

        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }

        if (event.relatedTarget !== null) {
            const parent = (event.relatedTarget as HTMLElement).parentElement;
            if (!parent) return;

            if (
                !parent.classList.contains('angular-editor-toolbar-set') &&
                !parent.classList.contains('ae-picker')
            ) {
                this.blurEvent.emit(event);
                this.focused = false;
            }
        }
    }

    /**
     *  focus the text area when the editor is focused
     */
    onFocus() {
        if (this._sourceMode) {
            this.textArea.nativeElement.focus();
        } else {
            const sourceText = this._editorService.getElementById(
                'sourceText' + this.id
            );
            sourceText?.focus();
            this.focused = true;
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param element html element from contenteditable
     */
    onContentChange(element: any | null): void {
        if (!element || !(element instanceof HTMLElement)) return;

        let html = '';

        if (this._sourceMode) {
            html = element.innerHTML;
        } else {
            html = element.innerText;
        }

        if (!html || html === '<br>') {
            html = '';
        }

        if (typeof this.onChange !== 'function') {
            this.changed = true;
            return;
        }

        const sanitized = this.editorConfig.sanitize
            ? this._sanitizer.sanitize(SecurityContext.HTML, html)
            : html;
        if (!sanitized) return;

        this.onChange(sanitized);

        if (!html !== this._showPlaceholder) {
            this.togglePlaceholder();
        }

        this.changed = true;
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    registerOnChange(fn: any): void {
        this.onChange = (e) => (e === '<br>' ? fn('') : fn(e));
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    writeValue(value: any): void {
        const hasContent = !value || value === '<br>' || value === '';

        if (hasContent !== this._showPlaceholder) {
            this.togglePlaceholder();
        }

        if (value === undefined || value === '' || value === '<br>') {
            value = null;
        }

        this.refreshView(value);
    }

    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    refreshView(value: string): void {
        const normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(
            this.textArea.nativeElement,
            'innerHTML',
            normalizedValue
        );

        return;
    }

    /**
     * Toggles placeholder based on input string
     */
    togglePlaceholder(): void {
        this._showPlaceholder = !this._showPlaceholder;
    }

    /**
     * Implements disabled state for this element
     *
     * @param isDisabled Disabled flag
     */
    setDisabledState(isDisabled: boolean): void {
        const div = this.textArea.nativeElement;
        const action = isDisabled ? 'addClass' : 'removeClass';
        this._renderer[action](div, 'disabled');
        this.disabled = isDisabled;
    }

    /**
     * Toggles between source and rich text editing mode
     */
    toggleEditorMode() {
        const editableElement = this.textArea.nativeElement;

        if (this._sourceMode) {
            this._renderSourceView(editableElement);
            return;
        }

        this._renderer.setProperty(
            editableElement,
            'innerHTML',
            editableElement.innerText
        );

        this._renderer.setProperty(editableElement, 'contentEditable', true);
        this._sourceMode = true;
        this.onContentChange(editableElement);
        editableElement.focus();

        this.editorToolbar.setEditorMode(!this.sourceMode.value);
    }

    private _renderSourceView(editableElement: HTMLElement) {
        const innerHTML = this._renderer.createText(editableElement.innerHTML);

        this._renderer.setProperty(editableElement, 'innerHTML', '');
        this._renderer.setProperty(editableElement, 'contentEditable', false);

        const preEle = this._renderer.createElement('pre');
        this._renderer.setStyle(preEle, 'margin', '0');
        this._renderer.setStyle(preEle, 'outline', 'none');

        const codeEle = this._renderer.createElement('code');
        this._renderer.setProperty(codeEle, 'id', 'sourceText' + this.id);
        this._renderer.setStyle(codeEle, 'display', 'block');
        this._renderer.setStyle(codeEle, 'white-space', 'pre-wrap');
        this._renderer.setStyle(codeEle, 'word-break', 'keep-all');
        this._renderer.setStyle(codeEle, 'outline', 'none');
        this._renderer.setStyle(codeEle, 'margin', '0');
        this._renderer.setProperty(codeEle, 'contentEditable', true);
        this._renderer.appendChild(codeEle, innerHTML);

        this.focusInstance = this._renderer.listen(codeEle, 'focus', (event) =>
            this.onTextAreaFocus(event)
        );
        this.blurInstance = this._renderer.listen(codeEle, 'blur', (event) =>
            this.onTextAreaBlur(event)
        );
        this._renderer.appendChild(preEle, codeEle);
        this._renderer.appendChild(editableElement, preEle);

        // ToDo move to service
        this._editorService.execCommand(
            'defaultParagraphSeparator',
            false,
            'div'
        );

        this.sourceMode.next(false);
        codeEle.focus();
    }

    /**
     * Toggles editor buttons when cursor moved or positioning
     * Send a node array from the contentEditable of the editor
     */
    exec() {
        this.editorToolbar.triggerButtons();

        let userSelection = this._editorService.getSelection();
        if (!userSelection) return;

        this._editorService.executeInNextQueueIteration(
            this._editorService.saveSelection
        );

        this._editorService.saveSelection();

        let a = userSelection.focusNode;
        const els = [];
        while (a && (<any>a).id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }
        this.editorToolbar.triggerBlocks(els);
    }

    getFonts() {
        return this.editorConfig.fonts.map((x) => {
            return { label: x.name, value: x.name };
        });
    }

    getCustomTags() {
        const tags = ['span'];
        this.editorConfig.customClasses.forEach((x) => {
            if (x.tag !== undefined) {
                if (!tags.includes(x.tag)) {
                    tags.push(x.tag);
                }
            }
        });
        return tags.join(',');
    }

    ngOnDestroy() {
        if (this.blurInstance) {
            this.blurInstance();
        }
        if (this.focusInstance) {
            this.focusInstance();
        }
    }

    filterStyles(html: string): string {
        html = html.replace('position: fixed;', '');
        return html;
    }
}
