import {
    Component,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

import { AngularEditorConfig } from '../../../angular-editor/src/lib/config';
import { AngularEditorToolbarConfig } from '../../../angular-editor/src/lib/toolbar-config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
    title = 'app';

    form: FormGroup;

    htmlContent1 = '';
    htmlContent2 = '';

    config1: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        sanitize: false,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',

    };

    config2: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'bottom',

    };

    testInput = "<h3><b>Testheadline</b></h3><div><h3><span>This is a test with:</span></h3></div><div><div><div><ul><li>An unordered list</li><li>A Headline</li></ul></div></div></div>";

    toolbarConfig: AngularEditorToolbarConfig = {
        showStrikeThrough: false,
        showSubscript: false,
        showSuperscript: false,
        showJustifyOptions: false,
        showFontSelect: false,
        showFontSizeOptions: false,
        showColorOptions: false,
        showCustomClassesSelect: false,
        showInsertImage: false,
        showInsertVideo: false,
        showHorizontalRule: false,
        showToggleEditorMode: false,
        // showClearFormat: false,
        headings: [
            {
                label: 'Überschrift 1',
                value: 'h1',
            },
            {
                label: 'Überschrift 2',
                value: 'h2',
            },
            {
                label: 'Überschrift 3',
                value: 'h3',
            },
            {
                label: 'Standard',
                value: 'default'
            },
        ],
    };

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            signature: [ 'test2', Validators.required ]
        });
    }

    onChange(event) {
        console.log('changed');
    }

    onBlur(event) {
        console.log('blur ' + event);
    }

    onChange2(event) {
        console.warn(this.form.value);
    }

    onChange3(event) {
        this.testInput = event;
    }
}
