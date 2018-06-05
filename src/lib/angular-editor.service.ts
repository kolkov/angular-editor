import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AngularEditorService {

  savedSelection: Range | null;
  selectedText: string;

  constructor() {
  }

  /**
   * Executed command from editor header buttons exclude toggleEditorMode
   * @param command string from triggerCommand
   */
  executeCommand(command: string) {
    if (command == 'h1' || command == 'h2' || command == 'h3' || command == 'h4' || command == 'h5' || command == 'h6' || command == 'p' || command == 'pre') {
      document.execCommand('formatBlock', false, command);
    }

    document.execCommand(command, false, null);
    return;
  }

  /**
   * Create URL link
   * @param url string from UI prompt
   */
  createLink(url: string) {
    if (!url.includes("http")) {
      document.execCommand('createlink', false, url);
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
        document.execCommand('foreColor', false, color);
      } else {
        document.execCommand('hiliteColor', false, color);
      }
    }

    return;
  }

  /**
   * Set font name
   * @param fontName string
   */
  setFontName(fontName: string) {
    document.execCommand("fontName", false, fontName);
  }

  /**
   * Create raw HTML
   * @param html HTML string
   */
  private insertHtml(html: string): void {

    const isHTMLInserted = document.execCommand('insertHTML', false, html);

    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }

    return;
  }

  /**
   * save selection when the editor is focussed out
   */
  saveSelection(): any {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        this.savedSelection = sel.getRangeAt(0);
        this.selectedText = sel.toString();
      }
    } else if (document.getSelection && document.createRange) {
      this.savedSelection = document.createRange();
    } else {
      this.savedSelection = null;
    }
  }

  /**
   * restore selection when the editor is focussed in
   *
   * saved selection when the editor is focussed out
   */
  restoreSelection(): boolean {
    if (this.savedSelection) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
        return true;
      } else if (document.getSelection /*&& this.savedSelection.select*/) {
        //this.savedSelection.select();
        return true;
      }
    } else {
      return false;
    }
  }

  /** check any slection is made or not */
  private checkSelection(): any {

    const slectedText = this.savedSelection.toString();

    if (slectedText.length === 0) {
      throw new Error('No Selection Made');
    }

    return true;
  }
}
