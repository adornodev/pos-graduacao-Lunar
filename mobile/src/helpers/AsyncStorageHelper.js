import moment from 'moment';

export class AsyncStorageHelper {
  static get Key() {
    return moment.utc().format('YYYYMMDD');
  }

  static get OldKeys() {
    values = [];
    minimumDate = moment.utc().subtract(1, 'months');
    currentDate = moment.utc();

    while (currentDate >= minimumDate) {
      values.append(currentDate.format('YYYYMMDD'));
      currentDate = currentDate.subtract(1, 'days');
    }

    return values;
  }
}
