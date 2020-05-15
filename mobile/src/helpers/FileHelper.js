import {AsyncStorageHelper} from './AsyncStorageHelper';

var RNFS = require('react-native-fs');

export class FileHelper {
  static getCsvFilename(filenameTemplate, key = '') {
    if (key) {
      return filenameTemplate.replace('{date}', key);
    }
    return filenameTemplate.replace('{date}', AsyncStorageHelper.key);
  }

  static getCsvLines(values, delimiter = '\r\n') {
    let result = '';

    if (!values || !Array.isArray(values)) return result;

    return values.join(delimiter);
  }

  static getFullFilePath(filename) {
    return RNFS.ExternalDirectoryPath + '/' + filename;
  }
}
