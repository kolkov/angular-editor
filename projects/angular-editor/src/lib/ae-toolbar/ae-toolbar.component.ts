import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {AngularEditorService, UploadResponse} from '../angular-editor.service';
import {HttpEvent, HttpResponse} from '@angular/common/http';

import {CustomClass} from '../config';
import {SelectOption} from '../ae-select/ae-select.component';
import {Observable} from 'rxjs';

@Component({
    selector: 'angular-editor-toolbar, ae-toolbar, div[aeToolbar]',
    templateUrl: './ae-toolbar.component.html',
    styleUrls: ['./ae-toolbar.component.scss'],
    standalone: false
})

export class AeToolbarComponent {
  htmlMode = false;

  headings: SelectOption[] = [
    {label: 'Heading 1', value: 'h1'},
    {label: 'Heading 2', value: 'h2'},
    {label: 'Heading 3', value: 'h3'},
    {label: 'Heading 4', value: 'h4'},
    {label: 'Heading 5', value: 'h5'},
    {label: 'Heading 6', value: 'h6'},
    {label: 'Paragraph', value: 'p'},
    {label: 'Predefined', value: 'pre'},
    {label: 'Standard', value: 'div'},
    {label: 'default', value: 'default'}
  ];

  fontSizes: SelectOption[] = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'}
  ];

  _customClasses: CustomClass[] = [];
  customClassList: SelectOption[] = [{label: '', value: ''}];

  @Input() id: string = '';
  @Input() uploadUrl: string = '';
  @Input() upload!: (file: File) => Observable<HttpEvent<UploadResponse>>;
  @Input() showToolbar: boolean = false;
  @Input() fonts: SelectOption[] = [{label: '', value: ''}];

  @Input()
  set customClasses(classes: CustomClass[]) {
    if (classes) {
      this._customClasses = classes;
      this.customClassList = this._customClasses.map((x, i) => ({label: x.name, value: i.toString()}));
      this.customClassList.unshift({label: 'Clear Class', value: '-1'});
    }
  }

  @Input()
  set defaultFontName(value: string) {
    if (value) {
      this.editorService.setInitialState({fontName: value});
    }
  }

  @Input()
  set defaultFontSize(value: string) {
    if (value) {
      this.editorService.setInitialState({fontSize: value});
    }
  }

  @Input() hiddenButtons: string[][] = [];

  @Output() execute: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('fileInput', {static: false}) myInputFile!: ElementRef;

  public get isLinkButtonDisabled(): boolean {
    return this.htmlMode || !this.editorService.selectedText;
  }

  protected editorService = inject(AngularEditorService);

  triggerCommand(command: string) {
    this.execute.emit(command);
  }

  setEditorMode(m: boolean) {
    this.htmlMode = m;
  }

  insertUrl() {
    let url = 'https://';
    const selection = this.editorService.savedSelection;
    if (selection && selection.commonAncestorContainer.parentElement?.nodeName === 'A') {
      const parent = selection.commonAncestorContainer.parentElement as HTMLAnchorElement;
      const href = parent.getAttribute('href');
      if (href !== '' && href !== null) {
        url = href;
      }
    }
    const promptUrl = prompt('Insert URL link', url);
    if (promptUrl && promptUrl !== '' && promptUrl !== 'https://') {
      this.editorService.createLink(promptUrl);
    }
  }

  insertVideo() {
    this.execute.emit('');
    const url = prompt('Insert Video link', `https://`);
    if (url && url !== '' && url !== `https://`) {
      this.editorService.insertVideo(url);
    }
  }

  insertColor(color: string, where: string) {
    this.editorService.insertColor(color, where);
    this.execute.emit('');
  }

  setFontName(fontName: string): void {
    this.editorService.setFontName(fontName);
    this.execute.emit('');
  }

  setFontSize(fontSize: string): void {
    this.editorService.setFontSize(fontSize);
    this.execute.emit('');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (file.type.includes('image/')) {
      if (this.upload) {
        this.upload(file).subscribe((response) => {
          if (response instanceof HttpResponse) {
            this.watchUploadImage(response as HttpResponse<{ imageUrl: string }>, event);
          }
        });
      } else if (this.uploadUrl) {
        this.editorService.uploadImage(file).subscribe((response) => {
          if (response instanceof HttpResponse) {
            this.watchUploadImage(response as HttpResponse<{ imageUrl: string }>, event);
          }
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          const fr = e.currentTarget as FileReader;
          if (fr.result !== null) {
            this.editorService.insertImage(fr.result.toString());
          }
          event.target.value = null;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchUploadImage(response: HttpResponse<{ imageUrl: string }>, event: any) {
    const body = response.body;
    if (body) {
      const {imageUrl} = body;
      this.editorService.insertImage(imageUrl);
    }
    event.srcElement.value = null;
  }

  setCustomClass(classId: string) {
    if (classId === '-1') {
      this.execute.emit('clear');
    } else {
      this.editorService.createCustomClass(this._customClasses[+classId]);
    }
  }

  isButtonHidden(name: string): boolean {
    if (!name) {
      return false;
    }
    if (!(this.hiddenButtons instanceof Array)) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    for (const arr of this.hiddenButtons) {
      if (arr instanceof Array) {
        result = arr.find(item => item === name);
      }
      if (result) {
        break;
      }
    }
    return result !== undefined;
  }

  focus() {
    this.execute.emit('focus');
  }
}
