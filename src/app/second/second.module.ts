import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondComponent } from './second/second.component';
import { Routes, RouterModule } from '@angular/router';
import { RouterI18nModule } from '../../../projects/router-i18n/src/public_api';

const secondRoutes: Routes = [
  {path: '', component: SecondComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(secondRoutes),
    RouterI18nModule
  ],
  declarations: [SecondComponent],
  exports: [
    RouterModule
  ]
})
export class SecondModule { }
