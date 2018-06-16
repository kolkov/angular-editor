import {Component, EventEmitter, Output, Renderer2} from "@angular/core";
import {AngularEditorService} from "./angular-editor.service";

@Component({
  selector: 'angular-editor-toolbar',
  templateUrl: './angular-editor-toolbar.component.html',
  styleUrls: ['./angular-editor-toolbar.component.scss']
})

export class AngularEditorToolbarComponent {

  id = '';
  htmlMode = false;

  block: string = 'default';
  fontName: string = 'Arial';
  fontSize: string = '5';

  tagMap = {
    BLOCKQUOTE: "indent",
    A: "link"
  };
  select = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV"];

  buttons = ["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent", "insertUnorderedList", "insertOrderedList", "link"];

  @Output() execute: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _renderer: Renderer2, private editorService: AngularEditorService) {
  }

  /**
   * Trigger command from editor header buttons
   * @param command string from toolbar buttons
   */
  triggerCommand(command: string) {
    this.execute.emit(command);
    return;
  }

  /**
   * highlight editor buttons when cursor moved or positioning
   */
  triggerButtons() {
    this.buttons.forEach(e => {
      let result = document.queryCommandState(e);
      let elementById = document.getElementById(e + '-' + this.id);
      if (result) {
        this._renderer.addClass(elementById, "active");
      } else {
        this._renderer.removeClass(elementById, "active");
      }
    });
  }

  /**
   * trigger highlight editor buttons when cursor moved or positioning in block
   */
  triggerBlocks(nodes: Node[]) {
    let found = false;
    this.select.forEach(y => {
      let node = nodes.find(x => x.nodeName == y);
      if (node != undefined && y == node.nodeName) {
        if (found == false) {
          this.block = node.nodeName.toLowerCase();
          found = true;
        }
      } else if (found == false) {
        this.block = 'default';
      }
    });

    Object.keys(this.tagMap).map(e => {
      let elementById = document.getElementById(this.tagMap[e] + '-' + this.id);

      let node = nodes.find(x => x.nodeName == e);

      if (node != undefined && e == node.nodeName) {
        this._renderer.addClass(elementById, "active");
      } else {
        this._renderer.removeClass(elementById, "active");
      }
    });
  }

  /**
   * insert URL link
   */
  insertUrl() {
    const url = prompt("Insert URL link", 'http:\/\/');
    if (url && url != '' && url != 'http://') {
      this.editorService.createLink(url);
    }
  }

  /** insert color */
  insertColor(color: string, where: string) {
    this.editorService.insertColor(color, where);
    this.execute.emit("");
  }

  /**
   * set font Name/family
   * @param fontName string
   */
  setFontName(fontName: string): void {
    this.editorService.setFontName(fontName);
    this.execute.emit("");
  }

  /**
   * set font Size
   * @param fontSize string
   *  */
  setFontSize(fontSize: string): void {
    this.editorService.setFontSize(fontSize);
    this.execute.emit("");
  }

  /**
   * toggle editor mode (WYSIWYG or SOURCE)
   * @param m boolean
   */
  setEditorMode(m: boolean) {
    const toggleEditorModeButton = document.getElementById("toggleEditorMode" + '-' + this.id);
    if (m) {
      this._renderer.addClass(toggleEditorModeButton, "active");
    } else {
      this._renderer.removeClass(toggleEditorModeButton, "active");
    }
    this.htmlMode = m;
    this.disableColorPicker();
  }

  /**
   * Disable color picker
   */
  disableColorPicker() {
    const foregroundColorPickerWrapper = document.getElementById("foregroundColorPickerWrapper");
    const backgroundColorPickerWrapper = document.getElementById("backgroundColorPickerWrapper");
    if (this.htmlMode) {
      this._renderer.addClass(foregroundColorPickerWrapper, "disabled");
      this._renderer.addClass(backgroundColorPickerWrapper, "disabled");
    } else {
      this._renderer.removeClass(foregroundColorPickerWrapper, "disabled");
      this._renderer.removeClass(backgroundColorPickerWrapper, "disabled");
    }
  }
}
