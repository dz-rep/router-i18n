import { TestBed, inject } from '@angular/core/testing';

import { RouterI18nStore } from './router-i18n-store.service';

describe('RouterI18nStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterI18nStore]
    });
  });

  it('should be created', inject([RouterI18nStore], (service: RouterI18nStore) => {
    expect(service).toBeTruthy();
  }));
});
