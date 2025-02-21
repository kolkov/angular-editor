import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { NEVER, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CustomClass } from './config';
import { formatHtmlTag } from './utils';

export interface UploadResponse {
    imageUrl: string;
}

@Injectable()
export class AngularEditorService {
    savedSelection?: Range | null;
    selectedText?: string;
    uploadUrl?: string;
    uploadWithCredentials?: boolean;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT) private _doc: Document
    ) {}

    public getSelection() {
        return this._doc.getSelection();
    }

    public getElementById(elementId: string) {
        return this._doc.getElementById(elementId);
    }

    /** @deprecated */
    public execCommand(commandId: string, showUI?: boolean, value?: string) {
        return this._doc.execCommand(commandId, showUI, value);
    }

    /** @deprecated */
    public queryCommandState(commandId: string) {
        return this._doc.queryCommandState(commandId);
    }

    /** @deprecated */
    public queryCommandValue(commandId: string) {
        return this._doc.queryCommandValue(commandId);
    }

    /**
     * Executed command from editor header buttons exclude toggleEditorMode
     * @param command string from triggerCommand
     * @param value
     * @deprecated
     */
    public executeCommand(command: string, value?: string) {
        const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code'];
        if (commands.includes(command)) {
            this.execCommand('formatBlock', false, command);
            return;
        }
        this.execCommand(command, false, value);
    }

    /**
     * Create URL link
     * @param url string from UI prompt
     * @deprecated
     */
    public createLink(url: string) {
        if (!url.includes('http')) {
            this.execCommand('createlink', false, url);
        } else {
            const newUrl =
                '<a href="' +
                url +
                '" target="_blank">' +
                this.selectedText +
                '</a>';
            this.insertHtml(newUrl);
        }
    }

    /**
     * insert color either font or background
     *
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     * @deprecated
     */
    public insertColor(color: string, where: string): void {
        const restored = this.restoreSelection();
        if (restored) {
            if (where === 'textColor') {
                this.execCommand('foreColor', false, color);
            } else {
                this.execCommand('hiliteColor', false, color);
            }
        }
    }

    /**
     * Set font name
     * @param fontName string
     * @deprecated
     */
    public setFontName(fontName: string) {
        // this.execCommand('fontName', false, fontName);
    }

    /**
     * Set font size
     * @param fontSize string
     * @deprecated
     */
    public setFontSize(fontSize: string) {
        // this.execCommand('fontSize', false, fontSize);
    }

    /**
     * Create raw HTML
     * @param html HTML string
     * @deprecated
     */
    public insertHtml(html: string): void {
        const isHTMLInserted = this.execCommand('insertHTML', false, html);

        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }
    }

    /**
     * save selection when the editor is focussed out
     */
    public saveSelection = (): void => {
        const sel = this._doc.getSelection();

        if (!sel) {
            this.savedSelection = null;
            return;
        }

        if (sel.rangeCount) {
            this.savedSelection = sel.getRangeAt(0);
            this.selectedText = sel.toString();
            return;
        }

        console.log;

        this.savedSelection = document.createRange();
    };

    /**
     * restore selection when the editor is focused in
     *
     * saved selection when the editor is focused out
     */
    restoreSelection(): boolean {
        if (!this.savedSelection) return false;

        const sel = this._doc.getSelection();
        if (!sel) return false;

        sel.removeAllRanges();
        sel.addRange(this.savedSelection);

        return true;
    }

    /**
     * setTimeout used for execute 'saveSelection' method in next event loop iteration
     */
    public executeInNextQueueIteration(
        callbackFn: (...args: any[]) => any,
        timeout = 1e2
    ): void {
        setTimeout(callbackFn, timeout);
    }

    /** check any selection is made or not */
    private checkSelection(): any {
        const selectedText = this.savedSelection?.toString();

        if (selectedText?.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }

    /**
     * Upload file to uploadUrl
     * @param file The file
     */
    uploadImage(file: File): Observable<HttpEvent<UploadResponse>> {
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
     * Insert image with Url
     * @param imageUrl The imageUrl.
     * @deprecated
     */
    insertImage(imageUrl: string) {
        this.execCommand('insertImage', false, imageUrl);
    }

    /**
     *
     * @deprecated
     */
    setDefaultParagraphSeparator(separator: string) {
        this.execCommand('defaultParagraphSeparator', false, separator);
    }

    /**
     * @param customClass
     * @deprecated
     */
    createCustomClass(customClass: CustomClass) {
        let newTag = this.selectedText;

        if (!newTag) return;
        if (!customClass) return this.insertHtml(newTag);

        this.insertHtml(
            formatHtmlTag(
                customClass.tag ? customClass.tag : 'span',
                this.selectedText ?? '',
                {
                    class: customClass.class
                }
            )
        );

        // const tagName = customClass.tag ? customClass.tag : 'span';
        // newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
    }

    nextNode(node: Node | ParentNode | null) {
        if (node?.hasChildNodes()) return node.firstChild;

        while (node && !node.nextSibling) {
            node = node.parentNode;
        }

        if (!node) return null;

        return node.nextSibling;
    }

    getRangeSelectedNodes(
        range: Range,
        includePartiallySelectedContainers: boolean
    ) {
        let node: Node | null = range.startContainer;
        const endNode = range.endContainer;
        let rangeNodes = [];

        // Special case for a range that is contained within a single node
        if (node === endNode) {
            rangeNodes = [node];
        } else {
            // Iterate nodes until we hit the end container
            while (node && node !== endNode) {
                rangeNodes.push((node = this.nextNode(node)));
            }

            // Add partially selected nodes at the start of the range
            node = range.startContainer;
            while (node && node !== range.commonAncestorContainer) {
                rangeNodes.unshift(node);
                node = node.parentNode;
            }
        }

        // Add ancestors of the range container, if required
        if (includePartiallySelectedContainers) {
            node = range.commonAncestorContainer;
            while (node) {
                rangeNodes.push(node);
                node = node.parentNode;
            }
        }

        return rangeNodes;
    }

    getSelectedNodes() {
        const nodes: (Node | null)[] = [];
        const sel = this._doc.getSelection();

        if (!sel) return nodes;

        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            nodes.push.apply(
                nodes,
                this.getRangeSelectedNodes(sel.getRangeAt(i), true)
            );
        }
        return nodes;
    }

    replaceWithOwnChildren(el: Node) {
        const parent = el.parentNode;
        if (!parent) return;

        while (el.hasChildNodes()) {
            if (!el.firstChild) continue;
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    }

    removeSelectedElements(tagNames: string) {
        const tagNamesArray = tagNames.toLowerCase().split(',');
        this.getSelectedNodes().forEach((node) => {
            if (!node) return;
            if (
                node.nodeType === 1 &&
                tagNamesArray.indexOf((<any>node).tagName.toLowerCase()) > -1 // @todo TypeScript error
            ) {
                // Remove the node and replace it with its children
                this.replaceWithOwnChildren(node);
            }
        });
    }
}

// insertVideo(videoUrl: string) {
//         if (videoUrl.match('www.youtube.com')) {
//             this.insertYouTubeVideoTag(videoUrl);
//         }
//         if (videoUrl.match('vimeo.com')) {
//             this.insertVimeoVideoTag(videoUrl);
//         }
//     }

//     private insertYouTubeVideoTag(videoUrl: string): void {
//         const id = videoUrl.split('v=')[1];
//         const imageUrl = `https://img.youtube.com/vi/${id}/0.jpg`;
//         const thumbnail = `
//       <div style='position: relative'>
//         <a href='${videoUrl}' target='_blank'>
//           <img src="${imageUrl}" alt="click to watch"/>
//           <img style='position: absolute; left:200px; top:140px'
//           src="https://img.icons8.com/color/96/000000/youtube-play.png"/>
//         </a>
//       </div>`;
//         this.insertHtml(thumbnail);
//     }

//     private insertVimeoVideoTag(videoUrl: string): void {
//         const sub = this.http
//             .get<any>(`https://vimeo.com/api/oembed.json?url=${videoUrl}`)
//             .subscribe((data) => {
//                 const imageUrl = data.thumbnail_url_with_play_button;
//                 const thumbnail = `<div>
//         <a href='${videoUrl}' target='_blank'>
//           <img src="${imageUrl}" alt="${data.title}"/>
//         </a>
//       </div>`;
//                 this.insertHtml(thumbnail);
//                 sub.unsubscribe();
//             });
//     }
