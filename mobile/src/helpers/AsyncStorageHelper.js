import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

export class AsyncStorageHelper {
  static get key() {
    return moment.utc().format('YYYYMMDD');
  }

  static async getContent(key='') {
    if (!key) {
      key = AsyncStorageHelper.key;
    }

    const rawValue = await AsyncStorage.getItem('measurements');

    if (!rawValue) return [];

    const measurements = JSON.parse(rawValue)[key];

    return measurements || []; 
  }

  static get oldKeys() {
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
