import React, {Component} from 'react';

import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

import Geolocation from 'react-native-geolocation-service';
import {Accelerometer} from '../../models/Accelerometer';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  AccelerometerButton,
  AccelerometerButtonText,
  AccelerometerValuesContainer,
  AccelerometerAxisKey,
  AccelerometerAxisValue,
  AccelerometerLabel,
} from './styles';

const Value = ({name, value}) => (
  <AccelerometerValuesContainer>
    <AccelerometerAxisKey>{name}:</AccelerometerAxisKey>
    <AccelerometerAxisValue>
      {new String(value).substr(0, 6)}
    </AccelerometerAxisValue>
  </AccelerometerValuesContainer>
);

export default class MeasuresScreen extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0,
    geolocation: {
      latitude: 0,
      longitude: 0,
      maximumAge: 2000,
      timeout: 20000,
      distanceFilter: 0,
      enableHighAccuracy: true,
    },
    watchId: 0,
    sub: null,
    isActive: false,
    measurements: [],
    settings: {interval: 500, batch_size: 10},
  };

  findCoordinates = () => {
    const {geolocation} = this.state;

    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        console.log(initialPosition);
        //this.setState({initialPosition});
      },
      error => console.error(error),
      geolocation
    );

    const watchId = Geolocation.watchPosition(
      position => {
        const lastPosition = JSON.stringify(position);
        console.log('last: ');
        console.log(lastPosition);
        //this.setState({lastPosition});
      },
      null,
      {
        distanceFilter: geolocation.distanceFilter,
        fastestInterval: 1000,
        interval: 3000,
      }
    );

    this.setState({watchId});
  };

  storeData = async measurements => {
    try {
      await AsyncStorage.setItem('measurements', 'stored value');
    } catch (e) {
      console.error(e);
    }
  };

  handleStartAccelerometer = isActive => {
    let {sub, measurements} = this.state;

    if (isActive) {
      sub.unsubscribe();
    } else {
      sub = accelerometer.subscribe(({x, y, z, timestamp}) => {
        const {measurements} = this.state;
        this.setState({
          x,
          y,
          z,
          measurements: [
            ...measurements,
            new Accelerometer(x, y, z).getCSVLine(),
          ],
        });
      });
    }

    this.setState({isActive: !isActive, sub});
  };

  async componentDidMount() {
    const measurements = await AsyncStorage.getItem('measurements');
    if (measurements) {
      this.setState({measurements: JSON.parse(measurements)});
    }
    const {settings} = this.state;
    /*
    setInterval(() => {
      console.log('teste');
    }, 5000);
*/
    setUpdateIntervalForType(SensorTypes.accelerometer, settings.interval);

    this.findCoordinates();
  }

  async componentDidUpdate(prevProps, prevState) {
    const {measurements, settings} = this.state;

    if (measurements.length >= settings.batch_size) {
      if (prevState.measurements !== measurements) {
        await AsyncStorage.setItem(
          'measurements',
          JSON.stringify(measurements)
        );
      }
    }
  }

  async componentWillUnmount() {
    let {sub, isActive, measurements, watchId} = this.state;

    if (sub) {
      sub.unsubscribe();
    }

    if (measurements.length > 0) {
      await AsyncStorage.setItem('measurements', JSON.stringify(measurements));
    }

    if (watchId) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }

    isActive = false;

    this.setState({
      sub: null,
      isActive: !isActive,
      measurements: [],
      watchId: watchId,
    });
  }

  render() {
    const {x, y, z, isActive} = this.state;

    return (
      <Container>
        <AccelerometerButton
          isActive={isActive}
          onPress={() => {
            this.handleStartAccelerometer(isActive);
          }}>
          <AccelerometerButtonText>
            {isActive ? 'Stop' : 'Start'}
          </AccelerometerButtonText>
        </AccelerometerButton>
        <AccelerometerLabel>Accelerometer values</AccelerometerLabel>
        <Value name="x" value={x} />
        <Value name="y" value={y} />
        <Value name="z" value={z} />
      </Container>
    );
  }
}
