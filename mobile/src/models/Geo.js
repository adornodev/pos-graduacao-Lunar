import {v4 as uuidv4} from 'uuid';

export class Geo {
  constructor(latitude, longitude, timestamp) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.timestamp = timestamp;
    this.id = uuidv4();
  }
}
