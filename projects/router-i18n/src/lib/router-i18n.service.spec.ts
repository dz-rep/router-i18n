import { TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { RouterI18nService, RouterI18nModule, RouterI18nParser } from '../public_api';
import { Router, Routes, RouterModule } from '@angular/router';
import { RouterI18nStore } from './router-i18n-store.service';
import { APP_BASE_HREF, Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RouterI18nPipe } from './router-i18n.pipe';

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

describe('RouterI18nService', () => {
  let parser: RouterI18nParser;
  let service: RouterI18nService;
  let store: RouterI18nStore;
  let router: Router;
  let pipe: RouterI18nPipe
  const routes: Routes = [
    { path: 'p1', redirectTo: '/p2' },
    { path: '**', redirectTo: '/' }
  ];
  let location: Location;

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
        { provide: TranslateService, useClass: FakeTranslateService },
        Location,
        RouterI18nPipe
      ]
    });
    service = TestBed.get(RouterI18nService);
    store = TestBed.get(RouterI18nStore);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    pipe = TestBed.get(RouterI18nPipe);
    console.log('beforeeach');
  });

  afterEach(() => {
    parser = undefined;
    service = undefined;
    store = undefined;
    router = undefined;
    pipe = undefined;
    location.go('/');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup store', () => {
    const langs = ['en', 'ru'];
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

    service.init(langs);
    expect(store.langs).toEqual(langs);
    expect(store.defaultLang).toEqual(langs[0]);
    expect(store.currentLang).toEqual(langs[0]);
    expect(store.defaultRoutes).toEqual(routes);
    expect(store.modifiedRoutes).toEqual(modifiedRoutes);
  });

  it('shouldn`t setup store', () => {
    service.init([]);
    expect(store.langs).toBe(undefined);
  });

  it('should throw exeption', () => {
    service.init(['en', 'ru'], 'it');
    expect(service.init).toThrow();
  });

  it('should change currentLang on router event', fakeAsync(() => {
    service.init(['en', 'ru']);
    router.navigateByUrl('/ru/test');
    tick(100);
    expect(store.currentLang).toEqual('ru');
  }));

  it('should change url on lang change', () => {
    service.init(['en', 'ru']);
    expect(location.path()).toBe('');
    service.changeLanguage('ru');
    expect(location.path()).toBe('/ru');
    service.setConfig({hideDefaultLang: false});
    service.changeLanguage('en');
    expect(location.path()).toBe('/en');
  });

  it('should get lang from url', () => {
    service.init(['en', 'ru']);
    expect(service.getUrlLang()).toBe(null);
    service.changeLanguage('ru');
    expect(service.getUrlLang()).toBe('ru');
  });

  it('should translate url', () => {
    service.init(['en', 'ru']);
    expect(service.translateUrl('/test')).toBe('/test');
    expect(service.translateUrl('/test#fragment')).toBe('/test#fragment');
    expect(service.translateUrl('/test/subtest/test')).toBe('/test/subtest/test');
    service.changeLanguage('ru');
    expect(service.translateUrl('/test')).toBe('/ru/test');
    expect(service.translateUrl('/test/subtest/test')).toBe('/ru/test/subtest/test');
    expect(service.translateUrl('/test#fragment')).toBe('/ru/test#fragment');
    service.changeLanguage('en');
    expect(service.translateUrl('/test')).toBe('/test');
    expect(service.translateUrl('/test/subtest/test')).toBe('/test/subtest/test');
    expect(service.translateUrl('/test#fragment')).toBe('/test#fragment');
    service.setConfig({hideDefaultLang: false});
    service.changeLanguage('ru');
    service.changeLanguage('en');
    expect(service.translateUrl('/test')).toBe('/en/test');
    expect(service.translateUrl('/test#fragment')).toBe('/en/test#fragment');
    expect(service.translateUrl('/test/subtest/test')).toBe('/en/test/subtest/test');
  });

  it('pipe should translate urls', () => {
    service.init(['en', 'ru']);
    expect(pipe.transform('/test')).toBe('/test');
    expect(pipe.transform('../')).toBe('../');
    expect(pipe.transform('../test')).toBe('../test');
    expect(pipe.transform('./')).toBe('./');
    service.changeLanguage('ru');
    expect(pipe.transform('/test')).toBe('/ru/test');
    expect(pipe.transform('../')).toBe('../');
    expect(pipe.transform('../test')).toBe('../test');
    expect(pipe.transform('./')).toBe('./');
    expect(pipe.transform('./test')).toBe('./test');
    service.setConfig({hideDefaultLang: false});
    service.changeLanguage('en');
    expect(pipe.transform('/test')).toBe('/en/test');
    expect(pipe.transform('../')).toBe('../');
    expect(pipe.transform('../test')).toBe('../test');
    expect(pipe.transform('./')).toBe('./');
  });

  it('should return current lang', () => {
    service.init(['en', 'ru']);
    expect(service.getCurrentLang()).toBe('en');
    service.changeLanguage('ru');
    expect(service.getCurrentLang()).toBe('ru');
    service.changeLanguage('en');
    expect(service.getCurrentLang()).toBe('en');
  });

  it('should return url without lang', () => {
    service.init(['en', 'ru']);
    expect(service.getUrlWithoutLang('/test')).toBe('/test');
    expect(service.getUrlWithoutLang('/ru/test')).toBe('/test');
    expect(service.getUrlWithoutLang('/en/test')).toBe('/test');
    expect(service.getUrlWithoutLang('/it/test')).toBe('/it/test');
    expect(service.getUrlWithoutLang('/en#fragment')).toBe('#fragment');
    expect(service.getUrlWithoutLang('/en/#fragment')).toBe('/#fragment');
    expect(service.getUrlWithoutLang('/en/test#fragment')).toBe('/test#fragment');
    expect(service.getUrlWithoutLang('/it/test#fragment')).toBe('/it/test#fragment');
  });

  it('should send lang on chage', fakeAsync(() => {
    service.init(['en', 'ru']);
    service.onLangChanged().subscribe(lang => {
      expect(lang).toEqual('ru');
    });
    tick(100);
    service.changeLanguage('en');
    service.changeLanguage('ru');
  }));
});
