import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterI18nComponent } from './router-i18n.component';

describe('RouterI18nComponent', () => {
  let component: RouterI18nComponent;
  let fixture: ComponentFixture<RouterI18nComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterI18nComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
