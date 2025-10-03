import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RouterI18nParser, RouterI18nModule, RouterI18nService } from '../public_api';
import { RouterI18nStore } from './router-i18n-store.service';
import { Routes, Router, RouterModule, NavigationStart } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

class FakeTranslateService {
  defLang: string;
  currentLang: string;

  setDefaultLang(lang: string): void {
    this.defLang = lang;
  }

  use(lang: string): void {
    this.currentLang = lang;
  }
}

class FakeRouter {
  config: Routes;
  event: Subject<NavigationStart> = new Subject();

  resetConfig(_routes: Routes) {
    this.config = _routes;
  }
}

describe('RouterI18nParserService', () => {
  let parser: RouterI18nParser;
  let service: RouterI18nService;
  let store: RouterI18nStore;
  let router: Router;
  const routes: Routes = [
    { path: 'p1', redirectTo: '/p2' },
    { path: '**', redirectTo: '/' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterI18nModule.forRoot(routes),
        RouterModule.forRoot(routes)
      ],
      providers: [
        RouterI18nService,
        RouterI18nParser,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: TranslateService, useClass: FakeTranslateService }
      ]
    });

    parser = TestBed.inject(RouterI18nParser);
    service = TestBed.inject(RouterI18nService);
    store = TestBed.inject(RouterI18nStore);
    store.langs = ['en', 'ru'];
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    parser = undefined;
    service = undefined;
    store = undefined;
    router = undefined;
  });

  it('should change router config', () => {
    parser.init();
    const modifiedRoutes: Routes = [
      { path: 'p1', redirectTo: '/p2' },
      {
        path: 'en', children: [
          { path: 'p1', redirectTo: '/p2' },
          { path: '**', redirectTo: '/' }
        ]
      },
      {
        path: 'ru', children: [
          { path: 'p1', redirectTo: '/p2' },
          { path: '**', redirectTo: '/' }
        ]
      },
      { path: '**', redirectTo: '/' }
    ];

    expect(store.modifiedRoutes).toEqual(modifiedRoutes);
  });

  it('should lang to be null', fakeAsync(() => {
    const listener = parser.init();
    listener.subscribe((result) => {
      expect(result).toBe(null);
    });
    router.navigateByUrl('/test');
  }));

  it('should lang to be en', fakeAsync(() => {
    const listener = parser.init();
    listener.subscribe((result) => {
      expect(result).toBe('en');
    });
    router.navigateByUrl('/en/test');
  }));

  it('shoudl remove lang from url', () => {
    const result = '/test';
    expect(parser.removeLangFromUrl('/test')).toBe(result);
    expect(parser.removeLangFromUrl('/en/test')).toBe(result);
    expect(parser.removeLangFromUrl('/test#fragment')).toBe('/test#fragment');
    expect(parser.removeLangFromUrl('/en/test#fragment')).toBe('/test#fragment');
    expect(parser.removeLangFromUrl('/en/test?param=test')).toBe('/test?param=test');
    expect(parser.removeLangFromUrl('/en/test?param=test#fragment')).toBe('/test?param=test#fragment');
  });

  it('should get lang from url', () => {
    expect(parser.getLangFromUrl('/test')).toBe(null);
    expect(parser.getLangFromUrl('/test#fragment')).toBe(null);
    expect(parser.getLangFromUrl('/it/test')).toBe(null);
    expect(parser.getLangFromUrl('/it/test#fragment')).toBe(null);
    expect(parser.getLangFromUrl('/en/test')).toBe('en');
    expect(parser.getLangFromUrl('/en/test#fragment')).toBe('en');
    expect(parser.getLangFromUrl('/en/test?param=test')).toBe('en');
    expect(parser.getLangFromUrl('/en/test?param=test#fragment')).toBe('en');
  });
});
