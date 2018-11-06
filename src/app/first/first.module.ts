import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstComponent } from './first/first.component';
import { Routes, RouterModule } from '@angular/router';
import { RouterI18nModule } from '../../../projects/router-i18n/src/public_api';

const firstRoutes: Routes = [
  {path: '', component: FirstComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(firstRoutes),
    RouterI18nModule
  ],
  declarations: [FirstComponent],
  exports: [
    RouterModule
  ]
})
export class FirstModule { }
