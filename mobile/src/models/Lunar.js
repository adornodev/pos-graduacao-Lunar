import {v4 as uuidv4} from 'uuid';

import {Accelerometer} from './Accelerometer';
import {Geo as Geolocation} from './Geo';

export class Lunar {
  constructor(accelerometer, geolocation, speedBumpId = 0) {
    this.accelerometer = accelerometer;
    this.geolocation = geolocation;
    this.id = uuidv4();
    this.speedBumpId = speedBumpId;
  }

  getCSVLine(sep = ';') {
    const {accelerometer, geolocation, id, speedBumpId} = this;
    const values = [
      id,
      speedBumpId,
      accelerometer.timestamp,
      accelerometer.x,
      accelerometer.y,
      accelerometer.z,
      geolocation.latitude,
      geolocation.longitude,
    ];

    return values.join(sep);
  }

  static fromCSVLines(lines, sep = ';') {
    let objects = [];

    if (!lines || (Array.isArray(lines) && lines.length < 1)) return objects;

    lines.forEach(line => {
      var values = line.split(sep);

      if (values.length !== 8) return;

      const accelerometerObj = new Accelerometer(
        values[3],
        values[4],
        values[5],
        values[2]
      );
      const geolocationObj = new Geolocation(values[6], values[7], values[2]);

      objects.push(new Lunar(accelerometerObj, geolocationObj, values[1]));
    });

    return objects;
  }
}
