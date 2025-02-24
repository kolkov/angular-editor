import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AeButtonComponent } from '../ae-button/ae-button.component';
import { AeSelectComponent } from '../ae-select/ae-select.component';
import { AeToolbarSetComponent } from '../ae-toolbar-set/ae-toolbar-set.component';
import { AngularEditorService } from '../angular-editor.service';
import { Block, CommandId, SelectOption } from '../types';
import { CustomClass, HiddenButtons } from '../config';
import { getButtons, makeFontSizes, makeFontStyle } from '../utils';
import { AeSelectionService } from '../ae-selection.service';

@Component({
    selector: 'angular-editor-toolbar, ae-toolbar, div[aeToolbar]',
    templateUrl: './ae-toolbar.component.html',
    styleUrls: ['./ae-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        AeButtonComponent,
        AeToolbarSetComponent,
        AeSelectComponent,
        FormsModule,
        MatTooltipModule
    ],
    standalone: true
})
export class AeToolbarComponent {
    @ViewChild('fileInput', { static: true })
    public myInputFile?: ElementRef;

    @Input()
    public id?: string;

    @Input()
    public showToolbar?: boolean;

    @Input()
    public fonts: SelectOption[] = [{ label: '', value: '' }];

    @Input()
    public set customClasses(classes: CustomClass[] | undefined) {
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
    public set defaultFontName(value: string | undefined) {
        if (value) {
            this.fontName = value;
        }
    }

    @Input()
    public set defaultFontSize(value: string | undefined) {
        if (value) {
            this.fontSize = value;
        }
    }

    @Input()
    public hiddenButtons?: Partial<HiddenButtons>;

    public htmlMode = false;
    public linkSelected = false;

    public block: Block = 'p';

    public foreColor?: string;
    public backColor?: string;

    public headings = makeFontStyle();
    public fontSizes = makeFontSizes();

    public customClassId = '-1';
    private _customClasses?: CustomClass[];
    public customClassList: SelectOption[] = [];

    public tagMap = { BLOCKQUOTE: 'indent', A: 'link' };

    public select = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'CODE'];

    public buttons = getButtons();

    constructor(
        private _renderer: Renderer2,
        private _editorService: AngularEditorService,
        private _selectionService: AeSelectionService,
        private _host: ElementRef<HTMLElement>
    ) {}

    public get isLinkButtonDisabled(): boolean {
        return this.htmlMode || !Boolean(this._selectionService.selectedText);
    }

    public get height() {
        return this._host.nativeElement.offsetHeight;
    }

    public get contentHeight() {
        return 'calc(100% - ' + this._host.nativeElement.offsetHeight + 'px)';
    }

    /**
     * Trigger command from toolbar button click
     * @param command string from toolbar buttons
     */
    public triggerCommand(command: CommandId) {
        this._editorService.executeCommand(command);
    }

    /**
     * Trigger command from toolbar button click
     * @param command string from toolbar buttons
     */
    public triggerButtons() {
        if (!this.showToolbar) return;

        this.buttons.forEach((e) => {
            const result = this._editorService.queryCommandState(e);
            const elementById = this._editorService.getElementById(
                e + '-' + this.id
            );

            if (result) {
                this._renderer.addClass(elementById, 'active');
            } else {
                this._renderer.removeClass(elementById, 'active');
            }
        });
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     * @param nodes Nodes at the cursor position
     */
    public triggerBlocks(nodes: Node[]) {
        if (!this.showToolbar) {
            return;
        }
        this.linkSelected = nodes.findIndex((x) => x.nodeName === 'A') > -1;
        let found = false;
        this.select.forEach((y) => {
            const node = nodes.find((x) => x.nodeName === y);
            if (node !== undefined && y === node.nodeName) {
                if (found === false) {
                    this.block = <Block>node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'p';
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
            const elementById = this._editorService.getElementById(
                this.tagMap[<keyof typeof this.tagMap>e] + '-' + this.id
            );

            const node = nodes.find((x) => x.nodeName === e);

            if (node !== undefined && e === node.nodeName) {
                this._renderer.addClass(elementById, 'active');
            } else {
                this._renderer.removeClass(elementById, 'active');
            }
        });

        this.foreColor = this._editorService.queryCommandValue('ForeColor');
        this.fontSize = this._editorService.queryCommandValue('FontSize');
        this.fontName = this._editorService
            .queryCommandValue('FontName')
            .replace(/"/g, '');
        this.backColor = this._editorService.queryCommandValue('backColor');
    }

    /**
     * insert link
     */
    public insertUrl() {
        let url: string | null = 'https:\/\/';
        const selection = this._selectionService.savedSelection;
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
            this._editorService.createLink(url);
        }
    }

    /** insert color */
    public insertColor(color: string, where: string) {
        this._editorService.insertColor(color, where);
    }

    /**
     * set font Name/family
     * @param foreColor string
     * @deprecated
     */
    public setFontName(foreColor: string): void {
        this._editorService.setFontName(foreColor);
    }

    /**
     * set font Size
     * @param fontSize string
     * @deprecated
     */
    public setFontSize(fontSize: string): void {
        this._editorService.setFontSize(fontSize);
    }

    /**
     * toggle editor mode (WYSIWYG or SOURCE)
     * @param mode boolean
     * @public
     */
    setEditorMode(mode: boolean) {
        const toggleEditorModeButton = this._editorService.getElementById(
            'toggleEditorMode' + '-' + this.id
        );

        if (mode) {
            this._renderer.addClass(toggleEditorModeButton, 'active');
        } else {
            this._renderer.removeClass(toggleEditorModeButton, 'active');
        }

        this.htmlMode = mode;
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

    /**
     * Set custom class
     */
    setCustomClass(classId: string) {
        if (classId === '-1') {
            this._editorService.execCommand('clear');
        } else {
            this._customClasses ??= [];
            this._editorService.createCustomClass(
                this._customClasses[+classId]
            );
        }
    }

    isButtonHidden(name: string): boolean {
        if (!Array.isArray(this.hiddenButtons)) return false;

        const found = this.hiddenButtons?.find((buttonGroup) => {
            if (buttonGroup instanceof Array) {
                return buttonGroup.find((item) => item === name);
            }
        });

        return found !== undefined;
    }

    focus() {
        this._editorService.execCommand('focus');
        console.log('focused');
    }

    /** @deprecated */
    public fontName = 'Times New Roman';

    /** @deprecated */
    fontSize = '3';
}

// @Input() uploadUrl?: string;
// @Input() upload?: (file: File) => Observable<HttpEvent<UploadResponse>>;
// watchUploadImage({ body }: HttpResponse<UploadResponse>, event: any) {
//     if (!body) return; // @todo - Error handling
//     const { imageUrl } = body;
//     this.editorService.insertImage(imageUrl);
//     event.srcElement.value = null;
// }
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
