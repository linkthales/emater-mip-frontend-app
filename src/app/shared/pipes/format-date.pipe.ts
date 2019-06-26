import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, format?: any): any {
    return moment(value)
      .locale('pt-br')
      .format(format);
  }
}
