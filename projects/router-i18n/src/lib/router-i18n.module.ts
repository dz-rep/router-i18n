import { NgModule, ModuleWithProviders} from '@angular/core';
import { RouterI18nComponent } from './router-i18n.component';
import { RouterI18nParser, APP_ROUTES } from './router-i18n-parser.service';
import { ROUTER_I18N_CONFIG, RouterI18nConfig } from './router-i18n.service';
import { Routes } from '@angular/router';
import { RouterI18nPipe } from './router-i18n.pipe';

@NgModule({
  imports: [
  ],
  declarations: [RouterI18nPipe, RouterI18nComponent],
  exports: [RouterI18nPipe]
})
export class RouterI18nModule {
  static forRoot(routes: Routes, config: RouterI18nConfig = {hideDefaultLang: true}): ModuleWithProviders<RouterI18nModule> {
    return {
      ngModule: RouterI18nModule,
      providers: [
        RouterI18nParser,
        {provide: APP_ROUTES, useValue: routes},
        {provide: ROUTER_I18N_CONFIG, useValue: config}
      ]
    };
  }

  // static forChild(): ModuleWithProviders {
  //   return {
  //     ngModule: RouterI18nModule
  //   }
  // }
}
