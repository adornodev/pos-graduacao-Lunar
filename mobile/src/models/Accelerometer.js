export class Accelerometer {
  constructor(x, y, z, timestamp = null) {
    this.x = x;
    this.y = y;
    this.z = z;

    if (!timestamp) {
      timestamp = this.getCurrentUTCTicks().toString();
    }

    this.timestamp = timestamp;
  }

  getCurrentUTCTicks() {
    var date = new Date();
    return date.getTime() + date.getTimezoneOffset() * 60000;
  }

  getCSVLine(sep = ';') {
    const {x, y, z, timestamp} = this;

    return `${x}${sep}${y}${sep}${z}${sep}${timestamp || ''}`;
  }
}

//export default new Accelerometer();
