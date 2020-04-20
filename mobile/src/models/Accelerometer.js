import {v4 as uuidv4} from 'uuid';

export class Accelerometer {
  constructor(x, y, z, timestamp = null) {
    this.x = x;
    this.y = y;
    this.z = z;

    if (!timestamp) {
      timestamp = this.getCurrentUTCTicks().toString();
    }
    this.timestamp = timestamp;

    this.id = uuidv4();
  }

  getCurrentUTCTicks() {
    var date = new Date();
    return date.getTime() + date.getTimezoneOffset() * 60000;
  }

  getCSVLine(sep = ';') {
    const {x, y, z, timestamp} = this;
    const values = [timestamp, x, y, z];

    return values.join(sep);
  }

  static fromCSVLines(lines, sep = ';') {
    let objects = [];

    if (!lines || (Array.isArray(lines) && lines.length < 1)) return objects;

    lines.forEach(line => {
      var values = line.split(sep);

      objects.push(
        new Accelerometer(values[1], values[2], values[3], values[0])
      );
    });

    return objects;
  }
}
