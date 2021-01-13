import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularEditorConfig } from "angular-editor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularEditorComponent } from "projects/angular-editor/src/public-api";
import insertTextAtCursor from "insert-text-at-cursor";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "app";
  @ViewChild("editorRef") editorRef: AngularEditorComponent;

  form: FormGroup;

  htmlContent1 = "";
  htmlContent2 = "";

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: "5rem",
    maxHeight: "15rem",
    placeholder: "Enter text here...",
    translate: "no",
    sanitize: false,
    // toolbarPosition: 'top',
    outline: true,
    defaultFontName: "Comic Sans MS",
    defaultFontSize: "5",
    // showToolbar: false,
    defaultParagraphSeparator: "p",
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };

  config2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: "5rem",
    maxHeight: "15rem",
    placeholder: "Enter text here...",
    translate: "no",
    sanitize: true,
    toolbarPosition: "bottom",
    defaultFontName: "Comic Sans MS",
    defaultFontSize: "5",
    defaultParagraphSeparator: "p",
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ["", Validators.required],
    });
    console.log(this.htmlContent1);
  }

  onChange(event) {
    console.log("changed");
  }

  onBlur(event) {
    console.log("blur " + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }
  insertAtCursor() {
    console.log(`insertAtCursors`);
    this.editorRef.focus();
    setTimeout(()=> this.editorRef.insert("dsfd"),2000);
    //this.editorRef.insert("dsfd");
    //
  }
  onTextAreaMouseOut(event) {
    console.log(`onTextAreaMouseOut`);
    console.log(event);
  }
}
