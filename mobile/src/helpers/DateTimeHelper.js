//import moment from 'moment';
import fromUnixTime from 'date-fns/fromUnixTime'
import format from 'date-fns/format'

export class DateTimeHelper {

  static ticksToDate(ticks, dateFormat='YYYY-MM-DD hh:mm:ss') {
    const normalizedTicks = ticks/1000;
    return format(fromUnixTime(normalizedTicks), 'yyyy-MM-dd HH:mm:ss');
  }
}