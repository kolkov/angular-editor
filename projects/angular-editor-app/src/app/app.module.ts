import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AngularEditorModule} from '../../../angular-editor/src/lib/angular-editor.module';
import { AppRoutingModule } from './app-routing.module';
import { ShadowDomComponent } from './shadow-dom/shadow-dom.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { ContainerComponent } from './shadow-dom/container/container.component';


@NgModule({
  declarations: [
    AppComponent,
    ShadowDomComponent,
    HomeComponent,
    NavComponent,
    ContainerComponent
  ],
  imports: [
    BrowserModule,
    AngularEditorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
