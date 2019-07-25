import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.sort((a: string, b: string) => {

        if (a < b) {
          return -1
        }
        if (a > b) {
          return 1
        }
        else {
          return 0
        }
      })
    }

  }
}
