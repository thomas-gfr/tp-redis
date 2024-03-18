import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'password',
  standalone: true
})
export class PasswordPipe implements PipeTransform {

  transform(value: string, hide: boolean = true): any {

    return hide ? value.replace(/./g, '*') : value;
  }
}