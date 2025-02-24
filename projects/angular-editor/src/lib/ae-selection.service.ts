import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AeSelectionService {
    public savedSelection: Range | null = null;
    public selectedText: string | null = null;

    constructor(@Inject(DOCUMENT) private _doc: Document) {}

    public getSelection() {
        return this._doc.getSelection();
    }

    /** check any selection is made or not */
    public checkForSelectedText(): any {
        const selectedText = this.savedSelection?.toString();

        if (selectedText?.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }

    /**
     * save selection when the editor is focussed out
     */
    public saveSelection(): void {
        const sel = this.getSelection();

        if (!sel) {
            this.savedSelection = null;
            return;
        }

        if (sel.rangeCount) {
            this.savedSelection = sel.getRangeAt(0);
            this.selectedText = sel.toString();
            return;
        }

        this.savedSelection = document.createRange();
    }

    /**
     * restore selection when the editor is focused in
     * saved selection when the editor is focused out
     */
    public restoreSelection(): boolean {
        if (!this.savedSelection) return false;

        const sel = this._doc.getSelection();
        if (!sel) return false;

        sel.removeAllRanges();
        sel.addRange(this.savedSelection);

        return true;
    }

    public getSelectedNodes() {
        const nodes: (Node | null)[] = [];
        const sel = this._doc.getSelection();

        if (!sel) return nodes;

        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            nodes.push.apply(
                nodes,
                this._getRangeSelectedNodes(sel.getRangeAt(i), true)
            );
        }
        return nodes;
    }

    private _getRangeSelectedNodes(
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
                rangeNodes.push((node = this._nextNode(node)));
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

    private _nextNode(node: Node | ParentNode | null) {
        if (node?.hasChildNodes()) return node.firstChild;

        while (node && !node.nextSibling) {
            node = node.parentNode;
        }

        if (!node) return null;

        return node.nextSibling;
    }

    public removeSelectedElements(tagNames: string) {
        const tagNamesArray = tagNames.toLowerCase().split(',');
        this.getSelectedNodes().forEach((node) => {
            if (!node) return;
            if (
                node.nodeType === 1 &&
                tagNamesArray.indexOf((<any>node).tagName.toLowerCase()) > -1 // @todo TypeScript error
            ) {
                // Remove the node and replace it with its children
                this._replaceWithOwnChildren(node);
            }
        });
    }

    private _replaceWithOwnChildren(el: Node) {
        const parent = el.parentNode;
        if (!parent) return;

        while (el.hasChildNodes()) {
            if (!el.firstChild) continue;
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    }
}
