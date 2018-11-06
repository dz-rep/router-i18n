import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule, Routes, Router } from '@angular/router';
// import { I18nService } from './services/i18n/i18n.service';
//TODO change to router-i18n
import { RouterI18nModule } from '../../projects/router-i18n/src/public_api';

import { AppComponent } from './app.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';

const appRoutes: Routes = [
  {path: '', loadChildren: './first/first.module#FirstModule'},
  {path: 'p2', loadChildren: './second/second.module#SecondModule'},
  {path: '**', redirectTo: '/p2'}
]

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(appRoutes),
    RouterI18nModule.forRoot(appRoutes)
  ],
  providers: [
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
