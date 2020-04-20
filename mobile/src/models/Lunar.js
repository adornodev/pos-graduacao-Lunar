import {v4 as uuidv4} from 'uuid';

export class Lunar {
  constructor(accelerometer, geolocation) {
    this.accelerometer = accelerometer;
    this.geolocation = geolocation;
    this.id = uuidv4();
  }

  getCSVLine(sep = ';') {
    const {accelerometer, geolocation, id} = this;
    const values = [
      id,
      accelerometer.timestamp,
      accelerometer.x,
      accelerometer.y,
      accelerometer.z,
      geolocation.latitude,
      geolocation.longitude,
    ];

    return values.join(sep);
  }
}
