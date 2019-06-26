import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHour'
})
export class FormatHourPipe implements PipeTransform {
  transform(hours: any, format?: string): any {
    if (hours && !format) {
      const hour = Math.floor(hours);
      return hour + 'h' + Math.trunc((hours - hour) * 60) + 'm';
    } else {
      return moment(hours)
        .utcOffset(0)
        .locale('pt-br')
        .format(format);
    }
  }
}
