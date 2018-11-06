import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Routes, Router, NavigationStart, Route } from '@angular/router';
import { RouterI18nStore } from './router-i18n-store.service';
import { Subject, Observable } from 'rxjs';

export const APP_ROUTES = new InjectionToken<string>('APP_ROUTES');

@Injectable()
export class RouterI18nParser {

  private langChangesSubject: Subject<string> = new Subject();

  constructor(
    @Inject(APP_ROUTES) private routes: Routes,
    private routerI18nStore: RouterI18nStore,
    private router: Router
  ) {
  }

  public init(): Observable<string> {
    this.configRoutes();
    this.listenRouterEvents();

    return this.langChangesSubject.asObservable();
  }

  private configRoutes(): void {
    this.routerI18nStore.defaultRoutes = [...this.routes];
    this.routerI18nStore.modifiedRoutes = this.parseRoutes();
    this.router.resetConfig(this.routerI18nStore.modifiedRoutes);
  }

  private parseRoutes(): Routes {

    const redirectedRouteIndex: number = this.routes.findIndex((route: Route) => route.path === '**');

    let redirectedRoute: Route;
    if (redirectedRouteIndex !== -1) {
      redirectedRoute = this.routes.find((item, index) => index === redirectedRouteIndex);
    }
    const routes: Routes = this.routes.filter((item) => item.path !== '**');

    this.routerI18nStore.langs.forEach(lang => {
      const route: Route = { path: lang, children: [...this.routes] };

      routes.push(route);
    });

    if (!!redirectedRoute) {
      routes.push(redirectedRoute);
    }

    return routes;
  }

  private listenRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.routeChanges(event.url);
      }
    });
  }

  public routeChanges(url: string): void {
    const lang = this.getLangFromUrl(url);
    this.langChangesSubject.next(lang);
  }

  public getLangFromUrl(url: string): string {
    const langSegment: string = url.split(/[\/#\?]/)[1];
 
    if (this.routerI18nStore.langs.indexOf(langSegment) !== -1) {
      return langSegment;
    }
    return null;
  }

  public removeLangFromUrl(url: string): string {
    const lang = this.getLangFromUrl(url);

    if (!lang) {
      return url;
    }

    url = url.replace(/[\/#\?]/g, '^$&');
    const urlSegments: string[] = url.split('^');

    urlSegments.splice(1, 1);

    return urlSegments.join('');
  }
}
