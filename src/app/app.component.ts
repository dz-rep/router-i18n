import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterI18nService } from '../../projects/router-i18n/src/public_api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'i18n-test-proj';

  constructor(
    private translateService: TranslateService,
    private rotuerI18n: RouterI18nService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.rotuerI18n.init(['en', 'ru']);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event);
      }
    })
  }

  ngOnDestroy() {
    console.log('app on destroy');
  }

  public changeLaguage(lang: string): void {
    this.rotuerI18n.changeLanguage(lang);
  }
}
