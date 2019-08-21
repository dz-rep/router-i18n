import { Injectable, InjectionToken, Inject } from '@angular/core';
import { RouterI18nParser } from './router-i18n-parser.service';
import { RouterI18nStore } from './router-i18n-store.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface RouterI18nConfig {
  hideDefaultLang?: boolean
}

export const ROUTER_I18N_CONFIG = new InjectionToken<RouterI18nConfig>('ROUTER_I18N_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class RouterI18nService {

  private langChangingSubject: Subject<string> = new Subject();
  private config: RouterI18nConfig = undefined;

  constructor(
    private routerI18nParser: RouterI18nParser,
    private routerI18nStore: RouterI18nStore,
    private translateService: TranslateService,
    private location: Location,
    private route: ActivatedRoute,
    @Inject(ROUTER_I18N_CONFIG) private _config: RouterI18nConfig
  ) {
    this.config = {..._config};
  }

  public init(_languages: string[], _defaultLang?: string): void {
    if (_languages.length === 0) {
      return;
    }
    this.routerI18nStore.langs = _languages;
    this.routerI18nParser.init().subscribe((lang: string) => this.listenToLangChanges(lang));

    try {
      this.setDefaultLang(_defaultLang);
    } catch (error) {
      console.error(error);
    }

    this.translateService.setDefaultLang(this.routerI18nStore.defaultLang);
    this.setLangOnInit();
  }

  private listenToLangChanges(lang: string): void {
    let newLang: string = lang;

    if (!newLang) {
      newLang = this.routerI18nStore.defaultLang;
    }
    if (this.routerI18nStore.currentLang === newLang) {
      return;
    }

    this.routerI18nStore.currentLang = newLang;
    this.translateService.use(this.routerI18nStore.currentLang);
    this.langChangingSubject.next(this.routerI18nStore.currentLang);
  }

  private setDefaultLang(_defaultLang: string): void {
    if (!_defaultLang) {
      this.routerI18nStore.defaultLang = this.routerI18nStore.langs[0];
      return;
    }

    if (this.routerI18nStore.langs.indexOf(_defaultLang) === -1) {
      throw new Error('Wrong default lang value!');
    }
    this.routerI18nStore.defaultLang = _defaultLang;
  }

  private setLangOnInit(): void {
    const url = this.location.path();
    const lang = this.routerI18nParser.getLangFromUrl(url);

    if (!lang) {
      this.routerI18nStore.currentLang = this.routerI18nStore.defaultLang;
      return;
    }

    this.routerI18nStore.currentLang = lang;
    this.translateService.use(this.routerI18nStore.currentLang);
    this.langChangingSubject.next(this.routerI18nStore.currentLang);
  }

  public changeLanguage(lang: string): void {
    if (this.routerI18nStore.langs.indexOf(lang) === -1) {
      console.error('Error! Wrong lang value!');
      return;
    }

    this.setLangToUrl(lang);
  }

  private setLangToUrl(lang: string): void {
    let url = this.location.path();
    const fragment = this.route.snapshot.fragment;

    url = url.replace(/[\/#\?]/g, '^$&');

    let urlSegments = url.split('^');
    const langInUrl = this.routerI18nParser.getLangFromUrl(this.location.path());

    if (langInUrl !== null) {
      urlSegments = urlSegments.slice(2);
    } else {
      urlSegments.shift();
    }

    if (lang !== this.routerI18nStore.defaultLang || (lang === this.routerI18nStore.defaultLang && !this.config.hideDefaultLang))
      urlSegments.unshift('/' + lang);

    let newUrl = urlSegments.join('');
    if (!!fragment)
      newUrl += `#${fragment}`;
    this.location.go(newUrl);
    this.routerI18nParser.routeChanges(this.location.path());
  }

  public getUrlLang(): string {
    const url = this.location.path();
    return this.routerI18nParser.getLangFromUrl(url);
  }

  public translateUrl(url: string): string {
    const langInUrl = this.routerI18nParser.getLangFromUrl(this.location.path());

    if (!langInUrl) {
      return url;
    }

    const lang = this.routerI18nStore.currentLang;

    url = url.replace(/[\/#\?]/g, '^$&'); //$& inserts the matched substring e.g. /test#fragment => ^/test^#fragment

    const urlSegments = url.split('^');

    if (lang !== this.routerI18nStore.defaultLang || (lang === this.routerI18nStore.defaultLang && !this.config.hideDefaultLang))
      urlSegments.unshift('/' + lang);

    return urlSegments.join('');
  }

  public getCurrentLang(): string {
    return this.routerI18nStore.currentLang;
  }

  public getUrlWithoutLang(url): string {
    return this.routerI18nParser.removeLangFromUrl(url);
  }

  public onLangChanged(): Observable<string> {
    return this.langChangingSubject.asObservable();
  }

  public setConfig(_config: RouterI18nConfig): void {
    this.config = {...this.config, ..._config};
  }
}
