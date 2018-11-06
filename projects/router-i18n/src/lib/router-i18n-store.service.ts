import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterI18nStore {

  public defaultRoutes: Routes;
  public modifiedRoutes: Routes;
  public langs: string[];
  public defaultLang: string;
  public currentLang: string;
}
