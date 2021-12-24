import { Component, OnInit, SecurityContext } from '@angular/core';
import { AngularEditorConfig } from 'angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    sanitize: (html) => this.sanitize(html),
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    // showToolbar: false,
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  allowedStyles = ['text-align'];
  allowedTags = ['p', 'span', 'div', 'hr', 'br', 'b', 'i', 'u', 'sup', 'sub', 'strike'];



  config2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: (html) => {
      return '<DIV>' + html + '</DIV>';
    },
    toolbarPosition: 'bottom',
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    //this.config1
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    console.log(this.htmlContent1);
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

  sanitize(html: string): string {
    let itres = this.sanitizer.sanitize(SecurityContext.STYLE, html).replace(new RegExp('\\</?[a-z]+:[a-z]+\\>', 'gi'), '').replace(/class="Mso[a-z]+"/ig, '');
    const matchTags = itres.match(/<\s*\/?(?<tag>[a-z0-9])\s*[^>]*>/ig);
    matchTags.forEach(m => {
      const matchTag = m.match(/<\s*\/?(?<tag>[a-z0-9])\s*[^>]*>/i);
      if (this.allowedTags.indexOf(matchTag.groups.tag) < 0) {
        itres = itres.replace(m, '');
      }
    });




    while (true) {
      const matchStyle = itres.match(/style\s*=\s*"(?<style>[^"]+)"/i);
      if (!matchStyle) { break; }
      const styles = matchStyle.groups.style.replace(/&quot;/ig, '"');
      const smatches = styles.match(/(?<name>[^;:]+)\s*:\s*(?<value>[^;]+);*/ig);
      const newStyles = [];
      smatches.forEach((v, i, a) => {
        const ssmatches = v.match(/(?<name>[^;:]+)\s*:\s*(?<value>[^;]+);*/i);
        const name = ssmatches.groups.name;
        if (this.allowedStyles.indexOf(name) >= 0) {
          newStyles.push(v);
        }
        const value = ssmatches.groups.value;
        console.log(`${name}=${value}`);
      });
      let attr = '';
      if (newStyles.length) { attr = `stylenew="${newStyles.join(';')}"`; }
      itres = itres.replace(matchStyle[0], attr);
    }
    return itres.replace('stylenew=', 'style=');
  }
}
