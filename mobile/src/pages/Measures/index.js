import React, {Component} from 'react';
import {View} from 'react-native';
import {withHub} from '../../Hub.js';
import {MEASUREMENTS_TO_DISPLAY} from '../../Events';

import {
  accelerometer as acc,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

import has from 'lodash/has';
import uniq from 'lodash/uniq';
import takeRight from 'lodash/takeRight';

import Geolocation from 'react-native-geolocation-service';

import {Accelerometer} from '../../models/Accelerometer';
import {Lunar} from '../../models/Lunar';
import {Geo} from '../../models/Geo';

import AsyncStorage from '@react-native-community/async-storage';

import cloneDeep from 'lodash/cloneDeep';

import {AsyncStorageHelper} from '../../helpers/AsyncStorageHelper';

import {
  Container,
  ButtonsContainer,
  ValuesContainer,
  AccelerometerValuesContainer,
  GpsValuesContainer,
  Divider,
  AccelerometerButton,
  AccelerometerButtonText,
  EventButton,
  EventButtonText,
  ValueKey,
  Value,
} from './styles';

const AccelerometerValue = ({name, value}) => (
  <View style={{flexDirection: 'row'}}>
    <ValueKey>{name}</ValueKey>
    <Value style={{flex: 1}}>
      {parseFloat(value)
        ? new String(value).substr(0, 8).padEnd(8)
        : '--------'}
    </Value>
  </View>
);

const GpsValue = ({name, value}) => (
  <View style={{flexDirection: 'column'}}>
    <ValueKey>{name}</ValueKey>
    <Value>
      {parseFloat(value)
        ? new String(value).substr(0, 8).padEnd(8)
        : '--------'}
    </Value>
  </View>
);

class MeasuresScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accelerometer: {
        x: 0,
        y: 0,
        z: 0,
        timestamp: null,
        settings: {
          interval: 250,
        },
      },
      geolocation: {
        latitude: 0,
        longitude: 0,
        timestamp: null,
        settings: {
          maximumAge: 2000,
          timeout: 20000,
          distanceFilter: 0,
          enableHighAccuracy: true,
          fastestInterval: 1000,
          interval: 3000,
        },
        subscribeId: 0,
      },
      settings: {
        asyncStorage: {
          batchSize: 20,
        },
        hub: {
          bathSize: 10,
        },
      },
      measurements: [],
      isActive: false,
    };

    this.accelerometerSubscriber = null;

    this.findCoordinates = this.findCoordinates.bind(this);
    this.storeData = this.storeData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleStartAccelerometer = this.handleStartAccelerometer.bind(this);
    this.processAccelerometerListener = this.processAccelerometerListener.bind(
      this
    );
  }

  findCoordinates = () => {
    const {
      geolocation: {settings},
    } = this.state;

    // Watching changes in geolocation
    const watchId = Geolocation.watchPosition(
      position => {
        //console.log(`last: ${Object.values(position)}`);
        if (position && has(position, 'coords')) {
          this.setState({
            geolocation: {
              latitude: position['coords']['latitude'],
              longitude: position['coords']['longitude'],
              timestamp: position['timestamp'],
            },
          });
        }
      },
      null,
      {
        distanceFilter: settings.distanceFilter,
        fastestInterval: settings.fastestInterval,
        interval: settings.interval,
      }
    );

    this.setState({geolocation: {subscribeId: watchId}});
  };

  storeData = async (measurements, key = null) => {
    try {
      if (measurements && measurements.length) {
        let _key = key;
        if (_key === null) {
          _key = AsyncStorageHelper.key;
        }
        const storagedMeasurements = await this.loadData(_key);

        console.log(
          `Saving ${measurements.length} data on AsyncStorage with ${_key} as key`
        );

        let obj = {};
        obj[_key] = !storagedMeasurements
          ? uniq(measurements)
          : uniq([...storagedMeasurements, ...measurements]);

        const msg = JSON.stringify(obj);

        console.log(
          `Total data on AsyncStorage with ${_key} as key: ${obj[_key].length}`
        );

        await AsyncStorage.setItem('measurements', msg);
      }
    } catch (e) {
      console.error(e);
    }
  };

  loadData = async (key = null) => {
    let _key = key;

    if (_key === null) {
      _key = AsyncStorageHelper.key;
    }

    // console.log(`Loading data from AsyncStorage with ${_key} as key`);

    const rawValue = await AsyncStorage.getItem('measurements');
    if (!rawValue) return [];

    const measurements = JSON.parse(rawValue)[_key];

    return measurements || [];
  };

  handleResetStoredData = async () => {
    try {
      await AsyncStorage.setItem('measurements', JSON.stringify([]));

      this.props.notify(MEASUREMENTS_TO_DISPLAY, []);
    } catch (e) {
      console.error(e);
    }
  };

  processAccelerometerListener(x, y, z, timestamp) {
    const {measurements, settings, geolocation} = this.state;

    const accelerometerObj = new Accelerometer(x, y, z, timestamp);

    const currentGeoObj = new Geo(
      geolocation.latitude,
      geolocation.longitude,
      geolocation.timestamp
    );

    let lunarObj = new Lunar(
      cloneDeep(accelerometerObj),
      cloneDeep(currentGeoObj)
    );

    this.setState(s => {
      s.accelerometer = {x, y, z, timestamp};
      s.measurements = [...measurements, lunarObj.getCSVLine()];
      return s;
    });

    // Sends measurements to AsyncStorage and Hub
    if (measurements.length >= settings.asyncStorage.batchSize) {
      this.storeData(measurements);

      this.props.notify(
        MEASUREMENTS_TO_DISPLAY,
        cloneDeep(takeRight(measurements, settings.hub.bathSize))
      );

      this.setState(s => {
        s.measurements = [];
        return s;
      });
    }
  }

  handleStartAccelerometer = isActive => {
    if (isActive) {
      this.accelerometerSubscriber.unsubscribe();

      const {measurements, settings} = this.state;

      // Save values into AsyncStorage and Sends to Hub
      if (measurements && measurements.length) {
        this.setState(
          s => {
            s.measurements = measurements;
            return s;
          },
          () => {
            this.storeData(measurements);
            this.props.notify(
              MEASUREMENTS_TO_DISPLAY,
              cloneDeep(takeRight(measurements, settings.hub.bathSize))
            );
          }
        );
      }
    } else {
      this.accelerometerSubscriber = acc.subscribe(({x, y, z, timestamp}) =>
        this.processAccelerometerListener(x, y, z, timestamp)
      );
    }

    this.setState({
      isActive: !isActive,
    });
  };

  async componentDidMount() {
    const {
      accelerometer: {settings},
    } = this.state;

    const measurements = await this.loadData();

    this.setState({measurements: measurements});

    setUpdateIntervalForType(SensorTypes.accelerometer, settings.interval);

    // Start GPS collector
    this.findCoordinates();
  }

  async componentWillUnmount() {
    const {
      measurements,
      geolocation: {subscribeId},
    } = this.state;

    if (this.accelerometerSubscriber) {
      this.accelerometerSubscriber.unsubscribe();
    }

    if (measurements && measurements.length > 0) {
      await AsyncStorage.setItem('measurements', JSON.stringify(measurements));
    }

    if (subscribeId) {
      Geolocation.clearWatch(subscribeId);
    }
  }

  handleSpeedBumpEvent = () => {
    const {
      geolocation: {settings},
      accelerometer,
      measurements,
    } = this.state;

    // Get current location
    Geolocation.getCurrentPosition(
      currentPosition => {
        const accelerometerObj = new Accelerometer(
          accelerometer.x,
          accelerometer.y,
          accelerometer.z,
          accelerometer.timestamp
        );

        const currentGeoObj = new Geo(
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
          currentPosition.timestamp
        );

        const lunarObj = new Lunar(
          cloneDeep(accelerometerObj),
          cloneDeep(currentGeoObj),
          true
        );

        this.setState(s => {
          s.measurements = [...measurements, lunarObj.getCSVLine()];
          return s;
        });

        alert('Event successfully registered');
      },
      error => {
        const msg = 'ERROR: ' + error.message;
        console.error(msg);
        alert(msg);
      },
      settings
    );
  };

  render() {
    const {
      accelerometer: {x, y, z},
      geolocation: {latitude, longitude},
      isActive,
    } = this.state;

    return (
      <Container>
        <ButtonsContainer>
          <AccelerometerButton
            isActive={isActive}
            onPress={() => {
              this.handleStartAccelerometer(isActive);
            }}>
            <AccelerometerButtonText>
              {isActive ? 'Stop' : 'Start'}
            </AccelerometerButtonText>
          </AccelerometerButton>

          <EventButton
            onPress={() => {
              this.handleSpeedBumpEvent();
            }}>
            <EventButtonText>SpeedBump</EventButtonText>
          </EventButton>
        </ButtonsContainer>
        <Divider />
        <ValuesContainer>
          <GpsValuesContainer>
            <GpsValue name="lat" value={latitude} />
            <GpsValue name="lng" value={longitude} />
          </GpsValuesContainer>
          <Divider />
          <AccelerometerValuesContainer>
            <AccelerometerValue name="x" value={x} />
            <AccelerometerValue name="y" value={y} />
            <AccelerometerValue name="z" value={z} />
          </AccelerometerValuesContainer>
        </ValuesContainer>
      </Container>
    );
  }
}

export default withHub(MeasuresScreen);
