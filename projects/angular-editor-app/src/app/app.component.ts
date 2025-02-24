import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {
    AngularEditorComponent,
    AngularEditorConfig
} from '@angular-elements/rich-text-editor';
import { sampleText } from './sample-text';
import { editorConfig } from './editor.config';
import { CommonModule } from '@angular/common';

console.log(document.createElement('div').getHTML());

const ANGULAR_EDITOR_LOGO_URL =
    'https://raw.githubusercontent.com/kolkov/angular-editor/master/docs/angular-editor-logo.png?raw=true';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        AngularEditorComponent,
        FormsModule,
        ReactiveFormsModule
    ],
    standalone: true
})
export class AppComponent {
    config = editorConfig;
    title = 'app';

    public textFormControl = new FormControl<string>(sampleText);

    htmlContent1 = '';
    htmlContent2 = '';
    angularEditorLogo = `<img alt="angular editor logo" src="${ANGULAR_EDITOR_LOGO_URL}">`;

    constructor(private formBuilder: UntypedFormBuilder) {}

    // ngOnInit() {
    //     this.form = this.formBuilder.group({
    //         signature: ['', Validators.required]
    //     });
    //     console.log(this.htmlContent1);
    // }

    onChange(event: any) {}

    onBlur(event: any) {}

    onChange2(event: any) {
        // console.warn(this.form?.value);
    }
}
