import { HttpClientModule } from '@angular/common/http';
import {
    async,
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AeSelectComponent } from './ae-select/ae-select.component';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';

describe('AngularEditorToolbarComponent', () => {
    let cut: AngularEditorToolbarComponent;
    let fixture: ComponentFixture<AngularEditorToolbarComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule, HttpClientModule ],
            declarations: [ AngularEditorToolbarComponent, AeSelectComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AngularEditorToolbarComponent);
        cut = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(cut).toBeTruthy();
    });

    describe('with no config input', () => {

        it('should have default config', () => {
            expect(cut.finalConfig).toEqual({
                showUndoRedoOptions: true,
                showUndo: true,
                showRedo: true,
                showFormatOptions: true,
                showBold: true,
                showItalic: true,
                showUnderline: true,
                showStrikeThrough: true,
                showSubscript: true,
                showSuperscript: true,
                showJustifyOptions: true,
                showJustifyLeft: true,
                showJustifyCenter: true,
                showJustifyRight: true,
                showJustifyFull: true,
                showIndentOptions: true,
                showIndent: true,
                showOutdent: true,
                showListOptions: true,
                showUnorderedList: true,
                showOrderedList: true,
                showHeadingOptions: true,
                showFontSelect: true,
                showFontSizeOptions: true,
                showColorOptions: true,
                showCustomClassesSelect: true,
                showMediaOptions: true,
                showLink: true,
                showUnlink: true,
                showInsertImage: true,
                showInsertVideo: true,
                showHorizontalRule: true,
                showClearFormat: true,
                showToggleEditorMode: true,
            });
        });
    });

    [
        // tslint:disable: max-line-length
        [ 'with showUndoRedoOptions set to false', { showUndoRedoOptions: false }, 'should not show UndoRedoOptions', 'button[title=Undo]' ],
        [ 'with showUndo set to false', { showUndo: false }, 'should not show Undo', 'button[title=Undo]' ],
        [ 'with showRedo set to false', { showRedo: false }, 'should not show Redo', 'button[title=Redo]' ],

        [ 'with showFormatOptions set to false', { showFormatOptions: false }, 'should not show FormatOptions', 'button[title=Bold]' ],
        [ 'with showBold set to false', { showBold: false }, 'should not show Bold', 'button[title=Bold]' ],
        [ 'with showItalic set to false', { showItalic: false }, 'should not show Italic', 'button[title=Italic]' ],
        [ 'with showUnderline set to false', { showUnderline: false }, 'should not show Underline', 'button[title=Underline]' ],
        [ 'with showStrikeThrough set to false', { showStrikeThrough: false }, 'should not show StrikeThrough', 'button[title=Strikethrough]' ],
        [ 'with showSubscript set to false', { showSubscript: false }, 'should not show Subscript', 'button[title=Subscript]' ],
        [ 'with showSuperscript set to false', { showSuperscript: false }, 'should not show Superscript', 'button[title=Superscript]' ],

        [ 'with showJustifyOptions set to false', { showJustifyOptions: false }, 'should not show JustifyOptions', 'button[title="Justify Left"]' ],
        [ 'with showJustifyLeft set to false', { showJustifyLeft: false }, 'should not show JustifyLeft', 'button[title="Justify Left"]' ],
        [ 'with showJustifyCenter set to false', { showJustifyCenter: false }, 'should not show JustifyCenter', 'button[title="Justify Center"]' ],
        [ 'with showJustifyRight set to false', { showJustifyRight: false }, 'should not show JustifyRight', 'button[title="Justify Right"]' ],
        [ 'with showJustifyFull set to false', { showJustifyFull: false }, 'should not show JustifyFull', 'button[title="Justify Full"]' ],

        [ 'with showIndentOptions set to false', { showIndentOptions: false }, 'should not show IndentOptions', 'button[title=Indent]' ],
        [ 'with showIndent set to false', { showIndent: false }, 'should not show Indent', 'button[title=Indent]' ],
        [ 'with showOutdent set to false', { showOutdent: false }, 'should not show Outdent', 'button[title=Outdent]' ],

        [ 'with showListOptions set to false', { showListOptions: false }, 'should not show ListOptions', 'button[title="Unordered List"]' ],
        [ 'with showUnorderedList set to false', { showUnorderedList: false }, 'should not show UnorderedList', 'button[title="Unordered List"]' ],
        [ 'with showOrderedList set to false', { showOrderedList: false }, 'should not show OrderedList', 'button[title="Ordered List"]' ],

        [ 'with showHeadingOptions set to false', { showHeadingOptions: false }, 'should not show HeadingOptions', '.select-heading' ],

        [ 'with showFontSelect set to false', { showFontSelect: false }, 'should not show FontSelect', '.select-font' ],

        [ 'with showFontSizeOptions set to false', { showFontSizeOptions: false }, 'should not show FontSizeOptions', '.select-font-size' ],

        [ 'with showColorOptions set to false', { showColorOptions: false }, 'should not show ColorOptions', 'button[title="Text Color"]' ],

        [ 'with showCustomClassesSelect set to false', { showCustomClassesSelect: false }, 'should not show CustomClassesSelect', '.select-custom-style' ],

        [ 'with showMediaOptions set to false', { showMediaOptions: false }, 'should not show MediaOptions', 'button[title="Insert Link"]' ],
        [ 'with showLink set to false', { showLink: false }, 'should not show Link', 'button[title="Insert Link"]' ],
        [ 'with showUnlink set to false', { showUnlink: false }, 'should not show Unlink', 'button[title=Unlink]' ],
        [ 'with showInsertImage set to false', { showInsertImage: false }, 'should not show InsertImage', 'button[title="Insert Image"]' ],
        [ 'with showInserVideo set to false', { showInsertVideo: false }, 'should not show InserVideo', 'button[title="Insert Video"]' ],
        [ 'with showHorizontalRule set to false', { showHorizontalRule: false }, 'should not show HorizontalRule', 'button[title="Horizontal Line"]' ],
        [ 'with showClearFormat set to false', { showClearFormat: false }, 'should not show ClearFormat', 'button[title="Clear Formatting"]' ],
        [ 'with showToggleEditorMode set to false', { showToggleEditorMode: false }, 'should not show ToggleEditorMode', 'button[title="HTML Code"]' ],
        // tslint:enable: max-line-length
    ].forEach(([ desc, config, exp, matcher ]: [string, any, string, string ]) => {

        describe(desc, () => {
            beforeEach(() => {
                cut.finalConfig = { ...cut.finalConfig, ...config };
                cut.customClasses = [ {
                    name: 'Test Class Name',
                    class: 'testClass',
                } ];
                fixture.detectChanges();
            });

            it(exp, () => {
                expect(element.querySelector(matcher)).toBe(null);
            });
        });
    });

    [
        // tslint:disable: max-line-length
        [ 'with showUndoRedoOptions set to true', { showUndoRedoOptions: true }, 'should show UndoRedoOptions', 'button[title=Undo]' ],
        [ 'with showUndo set to true', { showUndo: true }, 'should show Undo', 'button[title=Undo]' ],
        [ 'with showRedo set to true', { showRedo: true }, 'should show Redo', 'button[title=Redo]' ],

        [ 'with showFormatOptions set to true', { showFormatOptions: true }, 'should show FormatOptions', 'button[title=Bold]' ],
        [ 'with showBold set to true', { showBold: true }, 'should show Bold', 'button[title=Bold]' ],
        [ 'with showItalic set to true', { showItalic: true }, 'should show Italic', 'button[title=Italic]' ],
        [ 'with showUnderline set to true', { showUnderline: true }, 'should show Underline', 'button[title=Underline]' ],
        [ 'with showStrikeThrough set to true', { showStrikeThrough: true }, 'should show StrikeThrough', 'button[title=Strikethrough]' ],
        [ 'with showSubscript set to true', { showSubscript: true }, 'should show Subscript', 'button[title=Subscript]' ],
        [ 'with showSuperscript set to true', { showSuperscript: true }, 'should show Superscript', 'button[title=Superscript]' ],

        [ 'with showJustifyOptions set to true', { showJustifyOptions: true }, 'should show JustifyOptions', 'button[title="Justify Left"]' ],
        [ 'with showJustifyLeft set to true', { showJustifyLeft: true }, 'should show JustifyLeft', 'button[title="Justify Left"]' ],
        [ 'with showJustifyCenter set to true', { showJustifyCenter: true }, 'should show JustifyCenter', 'button[title="Justify Center"]' ],
        [ 'with showJustifyRight set to true', { showJustifyRight: true }, 'should show JustifyRight', 'button[title="Justify Right"]' ],
        [ 'with showJustifyFull set to true', { showJustifyFull: true }, 'should show JustifyFull', 'button[title="Justify Full"]' ],

        [ 'with showIndentOptions set to true', { showIndentOptions: true }, 'should show IndentOptions', 'button[title=Indent]' ],
        [ 'with showIndent set to true', { showIndent: true }, 'should show Indent', 'button[title=Indent]' ],
        [ 'with showOutdent set to true', { showOutdent: true }, 'should show Outdent', 'button[title=Outdent]' ],

        [ 'with showListOptions set to true', { showListOptions: true }, 'should show ListOptions', 'button[title="Unordered List"]' ],
        [ 'with showUnorderedList set to true', { showUnorderedList: true }, 'should show UnorderedList', 'button[title="Unordered List"]' ],
        [ 'with showOrderedList set to true', { showOrderedList: true }, 'should show OrderedList', 'button[title="Ordered List"]' ],

        [ 'with showHeadingOptions set to true', { showHeadingOptions: true }, 'should show HeadingOptions', '.select-heading' ],

        [ 'with showFontSelect set to true', { showFontSelect: true }, 'should show FontSelect', '.select-font' ],

        [ 'with showFontSizeOptions set to true', { showFontSizeOptions: true }, 'should show FontSizeOptions', '.select-font-size' ],

        [ 'with showColorOptions set to true', { showColorOptions: true }, 'should show ColorOptions', 'button[title="Text Color"]' ],

        [ 'with showCustomClassesSelect set to true', { showCustomClassesSelect: true }, 'should show CustomClassesSelect', '.select-custom-style' ],

        [ 'with showMediaOptions set to true', { showMediaOptions: true }, 'should show MediaOptions', 'button[title="Insert Link"]' ],
        [ 'with showLink set to true', { showLink: true }, 'should show Link', 'button[title="Insert Link"]' ],
        [ 'with showUnlink set to true', { showUnlink: true }, 'should show Unlink', 'button[title=Unlink]' ],
        [ 'with showInsertImage set to true', { showInsertImage: true }, 'should show InsertImage', 'button[title="Insert Image"]' ],
        [ 'with showInserVideo set to true', { showInsertVideo: true }, 'should show InserVideo', 'button[title="Insert Video"]' ],
        [ 'with showHorizontalRule set to true', { showHorizontalRule: true }, 'should show HorizontalRule', 'button[title="Horizontal Line"]' ],
        [ 'with showClearFormat set to true', { showClearFormat: true }, 'should show ClearFormat', 'button[title="Clear Formatting"]' ],
        [ 'with showToggleEditorMode set to true', { showToggleEditorMode: true }, 'should show ToggleEditorMode', 'button[title="HTML Code"]' ],
        // tslint:enable: max-line-length
    ].forEach(([ desc, config, exp, matcher ]: [ string, any, string, string ]) => {

        describe(desc, () => {
            beforeEach(() => {
                cut.finalConfig = { ...cut.finalConfig, ...config };
                cut.customClasses = [ {
                    name: 'Test Class Name',
                    class: 'testClass',
                } ];
                fixture.detectChanges();
            });

            it(exp, () => {
                expect(element.querySelector(matcher)).toBeTruthy();
            });
        });
    });
});
