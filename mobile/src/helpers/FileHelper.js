import {AsyncStorageHelper} from './AsyncStorageHelper';

export class FileHelper {
  
  static getCsvFilename(filenameTemplate, key = '') {
    if (key) {
      return filenameTemplate.replace('{date}', key)
    }
    return filenameTemplate.replace('{date}', AsyncStorageHelper.key)
  }
  static getCsvLines(values, delimiter='\r\n') {
    let result = '';

    if (!values || !Array.isArray(values))
      return result;

    return values.join(delimiter);
  }
}