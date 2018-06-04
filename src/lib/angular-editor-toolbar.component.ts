import {Component, EventEmitter, Output, Renderer2} from "@angular/core";
import {AngularEditorService} from "./angular-editor.service";

@Component({
  selector: 'angular-editor-toolbar',
  templateUrl: './angular-editor-toolbar.component.html',
  styleUrls: ['./angular-editor-toolbar.component.scss']
})

export class AngularEditorToolbarComponent {

  tagMap = {
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    PRE: "pre",
    BLOCKQUOTE: "indent",
    A: "link"
  };

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
      let elementById = document.getElementById(e);
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
    Object.keys(this.tagMap).map(e => {
      let elementById = document.getElementById(this.tagMap[e]);

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

  /**
   * toggle editor mode (WYSIWYG or SOURCE)
   * @param m boolean
   */
  setEditorMode(m: boolean) {
    const toggleEditorModeButton = document.getElementById("toggleEditorMode");
    if (m) {
      this._renderer.addClass(toggleEditorModeButton, "active");
    } else {
      this._renderer.removeClass(toggleEditorModeButton, "active");
    }
  }
}
