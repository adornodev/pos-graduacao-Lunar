import React, {Component} from 'react';
import {View} from 'react-native';
import {withHub} from '../../Hub.js';
import {MEASUREMENTS_TO_DISPLAY, DOWNLOAD_DATA} from '../../Events';

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
import {isArrayValid} from '../../helpers/ArrayHelper';

import {
  Container,
  ProcessButtonContainer,
  EventButtonContainer,
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
          batchSize: 100,
        },
        hub: {
          batchSize: 250,
        },
        displayData: {
          batchSize: 25,
        },
      },
      displayAccelerometerValues: {
        x: 0,
        y: 0,
        z: 0,
        timestamp: null,
      },
      isActive: false,
    };

    this.accelerometer = {
      x: 0,
      y: 0,
      z: 0,
      timestamp: null,
      settings: {
        interval: 100,
      },
    };
    this.measurements = [];
    this.accelerometerSubscriber = null;
    this.interval = null;
    this.updateInterval = 2000;

    this.findCoordinates = this.findCoordinates.bind(this);
    this.storeData = this.storeData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleStartAccelerometer = this.handleStartAccelerometer.bind(this);
    this.processAccelerometerListener = this.processAccelerometerListener.bind(
      this
    );
    this.hubSendMeasurementsToDownload = this.hubSendMeasurementsToDownload.bind(
      this
    );
    this.updateDisplayAccelerometerValues = this.updateDisplayAccelerometerValues.bind(
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

  hubSendMeasurementsToDownload(data, dateKey, forceDownload = false) {
    const {
      settings: {hub},
    } = this.state;

    if (forceDownload || (data && data.length >= hub.batchSize)) {
      this.props.notify(DOWNLOAD_DATA, dateKey);
    }
  }

  storeData = async (measurements, key = null) => {
    try {
      if (measurements && measurements.length) {
        let _key = key;
        if (_key === null) {
          _key = AsyncStorageHelper.key;
        }
        const storagedMeasurements = await this.loadData(_key);

        let obj = {};
        obj[_key] = !storagedMeasurements
          ? uniq(measurements)
          : uniq([...storagedMeasurements, ...measurements]);

        const msg = JSON.stringify(obj);

        // Check if is necessary send the msg to download_data hub
        this.hubSendMeasurementsToDownload(obj[_key], _key);

        console.log(
          `Total on AsyncStorage with ${_key} as key: ${obj[_key].length}`
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
    const {settings, geolocation} = this.state;

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

    this.measurements = [...this.measurements, lunarObj.getCSVLine()];
    this.accelerometer = {...this.accelerometer, x, y, z, timestamp};

    // Sends measurements to AsyncStorage and Hub
    if (
      this.measurements &&
      this.measurements.length >= settings.asyncStorage.batchSize
    ) {
      this.props.notify(
        MEASUREMENTS_TO_DISPLAY,
        cloneDeep(takeRight(this.measurements, settings.displayData.batchSize))
      );

      this.storeData(this.measurements);

      this.measurements = [];
    }
  }

  handleStartAccelerometer = isActive => {
    if (isActive) {
      if (this.accelerometerSubscriber != null)
        this.accelerometerSubscriber.unsubscribe();

      const {settings} = this.state;

      // Save values into AsyncStorage and Sends to Hubs
      if (isArrayValid(this.measurements)) {
        this.storeData(this.measurements);

        this.props.notify(
          MEASUREMENTS_TO_DISPLAY,
          cloneDeep(
            takeRight(this.measurements, settings.displayData.batchSize)
          )
        );

        this.hubSendMeasurementsToDownload(
          this.measurements,
          AsyncStorageHelper.key,
          true
        );
      }
    } else {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.updateDisplayAccelerometerValues();
        }, this.updateInterval);
      }

      this.accelerometerSubscriber = acc.subscribe(({x, y, z, timestamp}) =>
        this.processAccelerometerListener(x, y, z, timestamp)
      );
    }

    this.setState({
      isActive: !isActive,
    });
  };

  updateDisplayAccelerometerValues = () => {
    const {x, y, z, timestamp} = this.accelerometer;
    this.setState(s => {
      s.displayAccelerometerValues = {x, y, z, timestamp};
      return s;
    });
  };

  async componentDidMount() {
    const {settings} = this.accelerometer;

    clearInterval(this.interval);

    const data = await this.loadData();
    this.measurements = data;

    setUpdateIntervalForType(SensorTypes.accelerometer, settings.interval);

    // Start GPS collector
    this.findCoordinates();
  }

  async componentWillUnmount() {
    const {
      geolocation: {subscribeId},
    } = this.state;

    if (this.accelerometerSubscriber) {
      this.accelerometerSubscriber.unsubscribe();
    }

    if (isArrayValid(this.measurements)) {
      await AsyncStorage.setItem(
        'measurements',
        JSON.stringify(this.measurements)
      );
    }

    if (subscribeId) {
      Geolocation.clearWatch(subscribeId);
    }

    clearInterval(this.interval);
  }

  handleSpeedBumpEvent = speedBumpId => {
    const {
      geolocation: {settings},
    } = this.state;

    const {x, y, z, timestamp} = this.accelerometer;

    // Get current location
    Geolocation.getCurrentPosition(
      currentPosition => {
        const accelerometerObj = new Accelerometer(x, y, z, timestamp);

        const currentGeoObj = new Geo(
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
          currentPosition.timestamp
        );

        const lunarObj = new Lunar(
          cloneDeep(accelerometerObj),
          cloneDeep(currentGeoObj),
          speedBumpId
        );

        this.measurements = [...this.measurements, lunarObj.getCSVLine()];

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
      displayAccelerometerValues: {x, y, z},
      geolocation: {latitude, longitude},
      isActive,
    } = this.state;

    return (
      <Container>
        <ProcessButtonContainer>
          <AccelerometerButton
            isActive={isActive}
            onPress={() => {
              this.handleStartAccelerometer(isActive);
            }}>
            <AccelerometerButtonText>
              {isActive ? 'Stop' : 'Start'}
            </AccelerometerButtonText>
          </AccelerometerButton>
        </ProcessButtonContainer>
        <EventButtonContainer>
          <EventButton
            onPress={() => {
              this.handleSpeedBumpEvent(1);
            }}>
            <EventButtonText>SpeedBump 1</EventButtonText>
          </EventButton>

          <EventButton
            onPress={() => {
              this.handleSpeedBumpEvent(2);
            }}>
            <EventButtonText>SpeedBump 2</EventButtonText>
          </EventButton>
        </EventButtonContainer>
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
