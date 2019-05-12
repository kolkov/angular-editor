import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  htmlContent = '';

  ngOnInit() {
    console.log(this.htmlContent);
  }

  onChange(event) {
    console.log('changed');
  }
}
