import {Component, EventEmitter, Output, Renderer2} from "@angular/core";
import {AngularEditorService} from "./angular-editor.service";

@Component({
  selector: 'angular-editor-toolbar',
  templateUrl: './angular-editor-toolbar.component.html',
  styleUrls: ['./angular-editor-toolbar.component.scss']
})

export class AngularEditorToolbarComponent {

  tagMap = {
    B: "bold",
    I: "italic",
    U: "underline",
    STRIKE: "strikeThrough",
    SUB: "subscript",
    SUP: "superscript",
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    UL: "insertUnorderedList",
    OL: "insertOrderedList",
    BLOCKQUOTE: "indent",
    A: "link"
  };

  @Output() execute: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _renderer: Renderer2, private editorService: AngularEditorService){}

  triggerCommand(command: string){

    this.execute.emit(command);

    let elementById = document.getElementById(command);
    if (elementById){
      const result = elementById.classList.contains("active");
      if (result) {
        this._renderer.removeClass(elementById, "active");
      } else {
        this._renderer.addClass(elementById, "active");
      }
    }

    return;
  }

  triggerButton(nodes: any[]){
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

  insertUrl(){
    const url = prompt("Insert URL link", 'http:\/\/');
    if(url && url!='' && url != 'http://'){
      this.editorService.createLink(url);
    }
  }
}
