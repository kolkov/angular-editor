import {Inject, Injectable, DOCUMENT} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';

import {CustomClass} from './config';

export interface UploadResponse {
  imageUrl: string;
}

@Injectable()
export class AngularEditorService {

  savedSelection: Range | null;
  selectedText: string;
  uploadUrl: string;
  uploadWithCredentials: boolean;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private doc: any
  ) { }

  /**
   * Executed command from editor header buttons exclude toggleEditorMode
   * @param command string from triggerCommand
   * @param value
   */
  executeCommand(command: string, value?: string) {
    const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
    if (commands.includes(command)) {
      this.doc.execCommand('formatBlock', false, command);
      return;
    }
    this.doc.execCommand(command, false, value);
  }

  /**
   * Create URL link
   * @param url string from UI prompt
   */
  createLink(url: string) {
    if (!url.includes('http')) {
      this.doc.execCommand('createlink', false, url);
    } else {
      const newUrl = '<a href="' + url + '" target="_blank">' + this.selectedText + '</a>';
      this.insertHtml(newUrl);
    }
  }

  /**
   * insert color either font or background
   *
   * @param color color to be inserted
   * @param where where the color has to be inserted either text/background
   */
  insertColor(color: string, where: string): void {
    const restored = this.restoreSelection();
    if (restored) {
      if (where === 'textColor') {
        this.doc.execCommand('foreColor', false, color);
      } else {
        this.doc.execCommand('hiliteColor', false, color);
      }
    }
  }

  /**
   * Set font name
   * @param fontName string
   */
  setFontName(fontName: string) {
    this.doc.execCommand('fontName', false, fontName);
  }

  /**
   * Set font size
   * @param fontSize string
   */
  setFontSize(fontSize: string) {
    this.doc.execCommand('fontSize', false, fontSize);
  }

  /**
   * Create raw HTML
   * @param html HTML string
   */
  insertHtml(html: string): void {

    const isHTMLInserted = this.doc.execCommand('insertHTML', false, html);

    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }
  }

  /**
   * save selection when the editor is focussed out
   */
  public saveSelection = (): void => {
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        this.savedSelection = sel.getRangeAt(0);
        this.selectedText = sel.toString();
      }
    } else if (this.doc.getSelection && this.doc.createRange) {
      this.savedSelection = document.createRange();
    } else {
      this.savedSelection = null;
    }
  }

  /**
   * restore selection when the editor is focused in
   *
   * saved selection when the editor is focused out
   */
  restoreSelection(): boolean {
    if (this.savedSelection) {
      if (this.doc.getSelection) {
        const sel = this.doc.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
        return true;
      } else if (this.doc.getSelection /*&& this.savedSelection.select*/) {
        // this.savedSelection.select();
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * setTimeout used for execute 'saveSelection' method in next event loop iteration
   */
  public executeInNextQueueIteration(callbackFn: (...args: any[]) => any, timeout = 1e2): void {
    setTimeout(callbackFn, timeout);
  }

  /** check any selection is made or not */
  private checkSelection(): any {

    const selectedText = this.savedSelection.toString();

    if (selectedText.length === 0) {
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

    return this.http.post<UploadResponse>(this.uploadUrl, uploadData, {
      reportProgress: true,
      observe: 'events',
      withCredentials: this.uploadWithCredentials,
    });
  }

  /**
   * Insert image with Url
   * @param imageUrl The imageUrl.
   */
  insertImage(imageUrl: string) {
    this.doc.execCommand('insertImage', false, imageUrl);
  }

  setDefaultParagraphSeparator(separator: string) {
    this.doc.execCommand('defaultParagraphSeparator', false, separator);
  }

  /**
   * Apply custom class to selection with enterprise-level HTML structure preservation.
   * Supports three modes:
   * - 'inline': Wrap selection in a single element (legacy behavior)
   * - 'block': Apply class to each block element in selection
   * - 'auto': Smart detection based on selection span (default)
   *
   * @param customClass The custom class configuration
   */
  createCustomClass(customClass: CustomClass): void {
    if (!customClass || !this.savedSelection) {
      return;
    }

    const mode = customClass.mode || 'auto';
    const range = this.savedSelection;

    // Restore selection before applying
    this.restoreSelection();

    if (mode === 'inline') {
      this.applyClassInline(range, customClass);
    } else if (mode === 'block') {
      this.applyClassToBlocks(range, customClass);
    } else {
      // Auto mode: detect if selection spans multiple blocks
      const blocks = this.getBlockElementsInRange(range);
      if (blocks.length > 1) {
        this.applyClassToBlocks(range, customClass);
      } else {
        this.applyClassInline(range, customClass);
      }
    }
  }

  /**
   * Apply class inline by wrapping selection in a single element.
   * Uses extractContents + insertNode pattern for safety.
   */
  private applyClassInline(range: Range, customClass: CustomClass): void {
    const tagName = customClass.tag || 'span';

    try {
      // Create wrapper element
      const wrapper = this.doc.createElement(tagName);
      wrapper.className = customClass.class;

      // Extract contents and wrap (safer than surroundContents)
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);

      // Normalize to merge adjacent text nodes
      if (wrapper.parentNode) {
        wrapper.parentNode.normalize();
      }

      // Update selection to the new wrapper
      range.selectNodeContents(wrapper);
      const sel = this.doc.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      // Fallback to legacy method if DOM manipulation fails
      console.warn('applyClassInline failed, using fallback:', e);
      this.applyClassInlineFallback(customClass);
    }
  }

  /**
   * Fallback method for inline class application (legacy behavior).
   */
  private applyClassInlineFallback(customClass: CustomClass): void {
    const tagName = customClass.tag || 'span';
    const newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
    this.insertHtml(newTag);
  }

  /**
   * Apply class to each block element in selection.
   * Preserves HTML structure by adding class to existing elements.
   */
  private applyClassToBlocks(range: Range, customClass: CustomClass): void {
    const blocks = this.getBlockElementsInRange(range);

    if (blocks.length === 0) {
      // No blocks found, fall back to inline
      this.applyClassInline(range, customClass);
      return;
    }

    // Apply class to each block element
    blocks.forEach(block => {
      // Toggle class: remove if present, add if not
      if (block.classList.contains(customClass.class)) {
        block.classList.remove(customClass.class);
      } else {
        block.classList.add(customClass.class);
      }
    });

    // Trigger change detection by moving cursor
    const sel = this.doc.getSelection();
    if (sel && blocks.length > 0) {
      // Reselect the original range
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /**
   * Get all block-level elements within a range.
   * Returns elements that are fully or partially selected.
   */
  private getBlockElementsInRange(range: Range): HTMLElement[] {
    const blockTags = [
      'P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'LI', 'BLOCKQUOTE', 'PRE', 'ADDRESS', 'ARTICLE',
      'ASIDE', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'HEADER',
      'MAIN', 'NAV', 'SECTION'
    ];
    const blocks: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();

    // Get the common ancestor
    const container = range.commonAncestorContainer;
    const root = container.nodeType === Node.ELEMENT_NODE
      ? container as HTMLElement
      : container.parentElement;

    if (!root) {
      return blocks;
    }

    // If root itself is a block element and fully contains the range
    if (blockTags.includes(root.tagName) && this.isNodeFullyInRange(root, range)) {
      return [root];
    }

    // Find all block elements within the range using TreeWalker
    const walker = this.doc.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Element) => {
          if (!blockTags.includes(node.tagName)) {
            return NodeFilter.FILTER_SKIP;
          }
          // Check if node intersects with selection
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const element = node as HTMLElement;
      // Avoid duplicates and nested blocks
      if (!seen.has(element) && !this.hasAncestorInSet(element, seen)) {
        seen.add(element);
        blocks.push(element);
      }
    }

    // If no blocks found, check if we're inside a block
    if (blocks.length === 0) {
      let parent = root;
      while (parent && parent !== this.doc.body) {
        if (blockTags.includes(parent.tagName)) {
          blocks.push(parent);
          break;
        }
        parent = parent.parentElement;
      }
    }

    return blocks;
  }

  /**
   * Check if a node is fully contained within a range.
   */
  private isNodeFullyInRange(node: Node, range: Range): boolean {
    const nodeRange = this.doc.createRange();
    nodeRange.selectNodeContents(node);
    return range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 &&
           range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0;
  }

  /**
   * Check if element has an ancestor in the given set.
   */
  private hasAncestorInSet(element: HTMLElement, set: Set<HTMLElement>): boolean {
    let parent = element.parentElement;
    while (parent) {
      if (set.has(parent)) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  insertVideo(videoUrl: string) {
    if (videoUrl.match('www.youtube.com') || videoUrl.match('youtu.be')) {
      this.insertYouTubeVideoTag(videoUrl);
    }
    if (videoUrl.match('vimeo.com')) {
      this.insertVimeoVideoTag(videoUrl);
    }
  }

  private insertYouTubeVideoTag(videoUrl: string): void {
    // Support both formats: youtube.com/watch?v=ID and youtu.be/ID
    let id: string;
    if (videoUrl.includes('youtu.be/')) {
      id = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else {
      id = videoUrl.split('v=')[1].split('&')[0];
    }
    const imageUrl = `https://img.youtube.com/vi/${id}/0.jpg`;
    const thumbnail = `
      <div style='position: relative'>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="click to watch"/>
          <img style='position: absolute; left:200px; top:140px'
          src="https://img.icons8.com/color/96/000000/youtube-play.png"/>
        </a>
      </div>`;
    this.insertHtml(thumbnail);
  }

  private insertVimeoVideoTag(videoUrl: string): void {
    const sub = this.http.get<any>(`https://vimeo.com/api/oembed.json?url=${videoUrl}`).subscribe(data => {
      const imageUrl = data.thumbnail_url_with_play_button;
      const thumbnail = `<div>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="${data.title}"/>
        </a>
      </div>`;
      this.insertHtml(thumbnail);
      sub.unsubscribe();
    });
  }

  nextNode(node) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
        node = node.parentNode;
      }
      if (!node) {
        return null;
      }
      return node.nextSibling;
    }
  }

  getRangeSelectedNodes(range, includePartiallySelectedContainers) {
    let node = range.startContainer;
    const endNode = range.endContainer;
    let rangeNodes = [];

    // Special case for a range that is contained within a single node
    if (node === endNode) {
      rangeNodes = [node];
    } else {
      // Iterate nodes until we hit the end container
      while (node && node !== endNode) {
        rangeNodes.push( node = this.nextNode(node) );
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
    const nodes = [];
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      for (let i = 0, len = sel.rangeCount; i < len; ++i) {
        nodes.push.apply(nodes, this.getRangeSelectedNodes(sel.getRangeAt(i), true));
      }
    }
    return nodes;
  }

  replaceWithOwnChildren(el) {
    const parent = el.parentNode;
    while (el.hasChildNodes()) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
  }

  removeSelectedElements(tagNames) {
    const tagNamesArray = tagNames.toLowerCase().split(',');
    this.getSelectedNodes().forEach((node) => {
      if (node.nodeType === 1 &&
        tagNamesArray.indexOf(node.tagName.toLowerCase()) > -1) {
        // Remove the node and replace it with its children
        this.replaceWithOwnChildren(node);
      }
    });
  }
}
