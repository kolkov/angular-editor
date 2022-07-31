import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShadowDomComponent } from './shadow-dom/shadow-dom.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'shadow-dom',
    component: ShadowDomComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
