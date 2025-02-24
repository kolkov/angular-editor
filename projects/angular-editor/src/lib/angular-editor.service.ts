import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { NEVER, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CustomClass } from './config';
import { formatHtmlTag } from './utils';
import { CommandId } from './types';
import { AeSelectionService } from './ae-selection.service';

export interface UploadResponse {
    imageUrl: string;
}

@Injectable()
export class AngularEditorService {
    /**
     * The URL to upload images.
     */
    uploadUrl?: string;

    /**
     * Whether to include credentials in the upload request.
     */
    uploadWithCredentials?: boolean;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT)
        private _doc: Document,
        private _selection: AeSelectionService
    ) {}

    /**
     * Gets an element by its ID.
     * @param elementId The ID of the element.
     */
    public getElementById(elementId: string) {
        return this._doc.getElementById(elementId);
    }

    /**
     * Inserts HTML into the editor.
     * @param html The HTML to insert.
     */
    public insertHtml(html: string): void {
        const isHTMLInserted = this.execCommand('insertHTML', html, false);

        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }
    }

    /**
     * Executes a command on the document.
     * @param commandId The command ID.
     * @param commandValue The value for the command.
     * @param showUI Whether to show the UI.
     * @deprecated
     */
    public execCommand(
        commandId: CommandId,
        commandValue?: string,
        showUI?: boolean
    ) {
        return this._doc.execCommand(commandId, showUI, commandValue);
    }

    /**
     * Executes a command from the editor header buttons.
     * @param command The command to execute.
     * @param value The value for the command.
     * @deprecated
     */
    public executeCommand(command: CommandId, value?: string) {
        const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code'];
        if (commands.includes(command)) {
            this.execCommand('formatBlock', command, false);
            return;
        }
        this.execCommand(command, value, false);
    }

    /**
     * Queries the state of a command.
     * @param commandId The command ID.
     * @deprecated
     */
    public queryCommandState(commandId: string) {
        return this._doc.queryCommandState(commandId);
    }

    /**
     * Queries the value of a command.
     * @param commandId The command ID.
     * @deprecated
     */
    public queryCommandValue(commandId: string) {
        return this._doc.queryCommandValue(commandId);
    }

    /**
     * Creates a URL link.
     * @param url The URL to create a link for.
     * @deprecated
     */
    public createLink(url: string) {
        if (!url.includes('http')) {
            this.execCommand('createlink', url, false);
            return;
        }

        if (!this._selection.selectedText) return;

        const newUrl = this._doc.createElement('a');
        newUrl.href = url;
        newUrl.target = '_blank';
        newUrl.innerText = this._selection.selectedText;

        this.insertHtml(newUrl.getHTML());
    }

    /**
     * Inserts a color into the editor.
     * @param color The color to insert.
     * @param where Where to insert the color (text/background).
     * @deprecated
     */
    public insertColor(color: string, where: string): void {
        const restored = this._selection.restoreSelection();
        if (restored) {
            if (where === 'textColor') {
                this.execCommand('foreColor', color, false);
            } else {
                this.execCommand('hiliteColor', color, false);
            }
        }
    }

    /**
     * Sets the font name.
     * @param fontName The font name to set.
     * @deprecated
     */
    public setFontName(fontName: string) {
        // this.execCommand('fontName', false, fontName);
    }

    /**
     * Sets the font size.
     * @param fontSize The font size to set.
     * @deprecated
     */
    public setFontSize(fontSize: string) {
        // this.execCommand('fontSize', false, fontSize);
    }

    /**
     * Executes a callback function in the next event loop iteration.
     * @param callbackFn The callback function.
     * @param timeout The timeout in milliseconds.
     */
    public executeInNextQueueIteration(
        callbackFn: (...args: any[]) => any,
        timeout = 1e2
    ): void {
        setTimeout(callbackFn, timeout);
    }

    /**
     * Uploads an image to the upload URL.
     * @param file The file to upload.
     */
    public uploadImage(file: File): Observable<HttpEvent<UploadResponse>> {
        const uploadData: FormData = new FormData();

        uploadData.append('file', file, file.name);

        if (!this.uploadUrl) return NEVER;

        return this.http.post<UploadResponse>(this.uploadUrl, uploadData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: this.uploadWithCredentials
        });
    }

    /**
     * Inserts an image with a URL.
     * @param imageUrl The URL of the image.
     * @deprecated
     */
    public insertImage(imageUrl: string) {
        this.execCommand('insertImage', imageUrl, false);
    }

    /**
     * Sets the default paragraph separator.
     * @param separator The separator to set.
     * @deprecated
     */
    public setDefaultParagraphSeparator(separator: string) {
        this.execCommand('defaultParagraphSeparator', separator, false);
    }

    /**
     * Creates a custom class.
     * @param customClass The custom class to create.
     * @deprecated
     */
    public createCustomClass(customClass: CustomClass) {
        let newTag = this._selection.selectedText;

        if (!newTag) return;
        if (!customClass) return this.insertHtml(newTag);

        const ele = document.createElement(customClass.tag ?? 'span');
        ele.innerText = this._selection.selectedText ?? '';
        ele.classList.add(customClass.class);

        this.insertHtml(ele.getHTML());
    }
}
