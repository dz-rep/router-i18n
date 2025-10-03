import { Pipe, PipeTransform } from '@angular/core';
import { RouterI18nService } from './router-i18n.service';

@Pipe({
  name: 'routerI18n',
  pure: false
})
export class RouterI18nPipe implements PipeTransform {

  private value: string;
  constructor(
    private routerI18nService: RouterI18nService
  ) {

  }

  transform(_value: any): any {
    if (_value.indexOf('../') === 0 || _value.indexOf('./') === 0) return _value;
    
    this.value = this.routerI18nService.translateUrl(_value);

    return this.value;
  }

}
