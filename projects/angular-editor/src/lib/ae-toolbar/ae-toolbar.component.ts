import {
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    AngularEditorService,
    UploadResponse
} from '../angular-editor.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CustomClass, HiddenButtons } from '../config';
import {
    AeSelectComponent,
    SelectOption
} from '../ae-select/ae-select.component';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { AeButtonComponent } from '../ae-button/ae-button.component';
import { AeToolbarSetComponent } from '../ae-toolbar-set/ae-toolbar-set.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { makeFontSizes, makeFontStyle } from '../utils';

@Component({
    selector: 'angular-editor-toolbar, ae-toolbar, div[aeToolbar]',
    templateUrl: './ae-toolbar.component.html',
    styleUrls: ['./ae-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatSelectModule,
        AeButtonComponent,
        AeToolbarSetComponent,
        AeSelectComponent,
        FormsModule,
        MatTooltipModule
    ],
    standalone: true
})
export class AeToolbarComponent {
    htmlMode = false;
    linkSelected = false;
    block = 'p';
    fontName = 'Times New Roman';
    fontSize = '3';
    foreColor?: string;
    backColor?: string;

    headings = makeFontStyle();
    fontSizes = makeFontSizes();

    customClassId = '-1';
    _customClasses?: CustomClass[];
    customClassList: SelectOption[] = [{ label: '', value: '' }];

    tagMap = {
        BLOCKQUOTE: 'indent',
        A: 'link'
    };

    select = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'PRE', 'DIV'];

    buttons = [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'link'
    ];

    @Input() id?: string;
    // @Input() uploadUrl?: string;
    // @Input() upload?: (file: File) => Observable<HttpEvent<UploadResponse>>;
    @Input() showToolbar?: boolean;
    @Input() fonts: SelectOption[] = [{ label: '', value: '' }];

    @Input()
    set customClasses(classes: CustomClass[] | undefined) {
        if (classes) {
            this._customClasses = classes;
            this.customClassList = this._customClasses.map((x, i) => ({
                label: x.name,
                value: i.toString()
            }));
            this.customClassList.unshift({ label: 'Clear Class', value: '-1' });
        }
    }

    @Input()
    set defaultFontName(value: string | undefined) {
        if (value) {
            this.fontName = value;
        }
    }

    @Input()
    set defaultFontSize(value: string | undefined) {
        if (value) {
            this.fontSize = value;
        }
    }

    @Input()
    public hiddenButtons?: Partial<HiddenButtons>;

    @Output() execute: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('fileInput', { static: true }) myInputFile?: ElementRef;

    public get isLinkButtonDisabled(): boolean {
        return this.htmlMode || !Boolean(this.editorService.selectedText);
    }

    constructor(
        private r: Renderer2,
        private editorService: AngularEditorService,
        private _host: ElementRef<HTMLElement>
    ) {}

    public get height() {
        return this._host.nativeElement.offsetHeight;
    }

    public get contentHeight() {
        return 'calc(100% - ' + this._host.nativeElement.offsetHeight + 'px)';
    }

    /**
     * Trigger command from editor header buttons
     * @param command string from toolbar buttons
     */
    triggerCommand(command: string) {
        this.execute.emit(command);
    }

    /**
     * highlight editor buttons when cursor moved or positioning
     */
    triggerButtons() {
        if (!this.showToolbar) return;

        this.buttons.forEach((e) => {
            const result = this.editorService.queryCommandState(e);
            const elementById = this.editorService.getElementById(
                e + '-' + this.id
            );

            if (result) {
                this.r.addClass(elementById, 'active');
            } else {
                this.r.removeClass(elementById, 'active');
            }
        });
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    triggerBlocks(nodes: Node[]) {
        if (!this.showToolbar) {
            return;
        }
        this.linkSelected = nodes.findIndex((x) => x.nodeName === 'A') > -1;
        let found = false;
        this.select.forEach((y) => {
            const node = nodes.find((x) => x.nodeName === y);
            if (node !== undefined && y === node.nodeName) {
                if (found === false) {
                    this.block = node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'default';
            }
        });

        found = false;
        if (this._customClasses) {
            this._customClasses.forEach((y, index) => {
                const node = nodes.find((x) => {
                    if (!(x instanceof Element)) return;
                    return x.className === y.class;
                });
                if (node !== undefined) {
                    if (found === false) {
                        this.customClassId = index.toString();
                        found = true;
                    }
                } else if (found === false) {
                    this.customClassId = '-1';
                }
            });
        }

        Object.keys(this.tagMap).map((e) => {
            const elementById = this.editorService.getElementById(
                this.tagMap[<keyof typeof this.tagMap>e] + '-' + this.id
            );
            const node = nodes.find((x) => x.nodeName === e);
            if (node !== undefined && e === node.nodeName) {
                this.r.addClass(elementById, 'active');
            } else {
                this.r.removeClass(elementById, 'active');
            }
        });

        this.foreColor = this.editorService.queryCommandValue('ForeColor');
        this.fontSize = this.editorService.queryCommandValue('FontSize');
        this.fontName = this.editorService
            .queryCommandValue('FontName')
            .replace(/"/g, '');
        this.backColor = this.editorService.queryCommandValue('backColor');
    }

    /**
     * insert URL link
     */
    insertUrl() {
        let url: string | null = 'https:\/\/';
        const selection = this.editorService.savedSelection;
        if (
            selection &&
            selection.commonAncestorContainer.parentElement?.nodeName === 'A'
        ) {
            const parent = selection.commonAncestorContainer
                .parentElement as HTMLAnchorElement;
            if (parent.href !== '') {
                url = parent.href;
            }
        }
        url = prompt('Insert URL link', url);
        if (url && url !== '' && url !== 'https://') {
            this.editorService.createLink(url);
        }
    }

    /** insert color */
    insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        this.execute.emit('');
    }

    /**
     * set font Name/family
     * @param foreColor string
     */
    setFontName(foreColor: string): void {
        this.editorService.setFontName(foreColor);
        this.execute.emit('');
    }

    /**
     * set font Size
     * @param fontSize string
     */
    setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        this.execute.emit('');
    }

    /**
     * toggle editor mode (WYSIWYG or SOURCE)
     * @param m boolean
     */
    setEditorMode(m: boolean) {
        const toggleEditorModeButton = this.editorService.getElementById(
            'toggleEditorMode' + '-' + this.id
        );
        if (m) {
            this.r.addClass(toggleEditorModeButton, 'active');
        } else {
            this.r.removeClass(toggleEditorModeButton, 'active');
        }
        this.htmlMode = m;
    }

    /**
     * Upload image when file is selected.
     */
    onFileChanged(event: any) {
        const file = event.target.files[0];

        if (!file.type.includes('image/')) return;

        // if (this.upload) {
        //     this.upload(file).subscribe({
        //         next: (response) => this.watchUploadImage(<any>response, event)
        //     });
        // } else if (this.uploadUrl) {
        //     this.editorService.uploadImage(file).subscribe({
        //         next: (response) => {
        //             this.watchUploadImage(<any>response, event);
        //         }
        //     });
        // } else {
        //     const reader = new FileReader();
        //     reader.onload = (e: ProgressEvent) => {
        //         const { result } = e.currentTarget as FileReader;
        //         if (!result) return; // @todo - Error handling
        //         this.editorService.insertImage(result.toString());
        //     };
        //     reader.readAsDataURL(file);
        // }
    }

    // watchUploadImage({ body }: HttpResponse<UploadResponse>, event: any) {
    //     if (!body) return; // @todo - Error handling
    //     const { imageUrl } = body;
    //     this.editorService.insertImage(imageUrl);
    //     event.srcElement.value = null;
    // }

    /**
     * Set custom class
     */
    setCustomClass(classId: string) {
        if (classId === '-1') {
            this.execute.emit('clear');
        } else {
            this._customClasses ??= [];
            this.editorService.createCustomClass(this._customClasses[+classId]);
        }
    }

    isButtonHidden(name: string): boolean {
        if (!name) {
            return false;
        }
        if (!(this.hiddenButtons instanceof Array)) {
            return false;
        }
        let result: any;
        for (const arr of this.hiddenButtons) {
            if (arr instanceof Array) {
                result = arr.find((item) => item === name);
            }
            if (result) {
                break;
            }
        }
        return result !== undefined;
    }

    focus() {
        this.execute.emit('focus');
        console.log('focused');
    }
}

// /**
//      * insert Video link
//      */
//     insertVideo() {
//         this.execute.emit('');
//         const url = prompt('Insert Video link', `https://`);
//         if (url && url !== '' && url !== `https://`) {
//             this.editorService.insertVideo(url);
//         }
//     }
