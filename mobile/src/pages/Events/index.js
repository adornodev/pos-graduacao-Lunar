import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import '../../config/ReactotronConfig';

import {withHub} from '../../Hub';
import {EVENT_TEST} from '../../Events';

import cloneDeep from 'lodash/cloneDeep';

import {Accelerometer} from '../../models/Accelerometer';

import {
  Container,
  EmptyContainer,
  EmptyText,
  Item,
  Timestamp,
  AccelerometerValues,
  GPSValues,
  AccelerometerContent,
  GPSContent,
  Content,
  Header,
  MeasurementsList,
} from './styles';

class EventsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedMeasurements: [],
      measurements: [],
      measurements_test: [
        {
          x: 2,
          y: 3,
          z: 10,
          id: Math.random().toFixed(4),
          lat: -23.32320323,
          lng: 12.23131231,
        },
        {
          x: 3,
          y: 5,
          z: 110,
          id: Math.random().toFixed(4),
          lat: -23.4444,
          lng: 12.3333,
        },
        {
          x: 4,
          y: 3.23,
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 5,
          y: 3.23,
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 6,
          y: 3.23,
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 7,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 8,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 9,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 10,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 11,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 12,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 13,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 14,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 15,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: -16,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 17,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 18,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 19,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 20,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 21,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 22,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 23,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 24,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 25,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 26,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 27,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 28,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 29,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 30,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 31,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 32,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 33,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 34,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
        {
          x: 35,
          y: Math.random().toFixed(4),
          z: 0,
          id: Math.random().toFixed(4),
          lat: -23.1111,
          lng: 12.2222,
        },
      ],
      page: 0,
      pageSize: 10,
    };

    this.loadHubStoredMeasurements = this.loadHubStoredMeasurements.bind(this);

    props.attach(EVENT_TEST, this.loadHubStoredMeasurements, true);
  }

  loadHubStoredMeasurements = message => {
    const {displayedMeasurements, pageSize} = this.state;

    const newMessage = message ? cloneDeep(message) : [];

    const objects = Accelerometer.fromCSVLines(newMessage);

    let paginatedObjects = [];

    if (Array.isArray(displayedMeasurements) && !displayedMeasurements.length) {
      paginatedObjects = objects.slice(0, pageSize);
    }

    this.setState({
      measurements: objects,
      displayedMeasurements: paginatedObjects,
    });
  };

  loadStateStoredMeasurements = () => {
    const {measurements, page, pageSize, displayedMeasurements} = this.state;

    const start = page * pageSize;
    const end = page * pageSize + pageSize;

    const moreMeasurements = measurements.slice(start, end);

    this.setState(
      {
        displayedMeasurements: [...displayedMeasurements, ...moreMeasurements],
      },
      () => {
        console.tron.warn(
          `Tamanho do displayed result: ${displayedMeasurements.length}`
        );
      }
    );
  };

  renderItem = ({item}) => {
    console.log(`item: ${Object.entries(item)}`);
    return (
      <Item key={item.id}>
        <Header>
          <Timestamp>{item.timestamp}</Timestamp>
        </Header>
        <Content>
          <AccelerometerContent>
            <AccelerometerValues>X: {item.x}</AccelerometerValues>
            <AccelerometerValues>Y: {item.y}</AccelerometerValues>
            <AccelerometerValues>Z: {item.z}</AccelerometerValues>
          </AccelerometerContent>
          <GPSContent>
            <GPSValues>Lat: {item.lat}</GPSValues>
            <GPSValues>Lng: {item.lng}</GPSValues>
          </GPSContent>
        </Content>
      </Item>
    );
  };

  handleLoadMoreStoredMeasures = () => {
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
      }),
      () => {
        this.loadStateStoredMeasurements();
      }
    );
  };

  render() {
    const {displayedMeasurements} = this.state;

    return (
      <Container>
        {displayedMeasurements.length > 0 ? (
          <>
            <MeasurementsList
              vertical
              data={displayedMeasurements}
              extraData={this.props}
              keyExtractor={item => String(item.id)}
              renderItem={this.renderItem}
              onEndReached={this.handleLoadMoreStoredMeasures}
              onEndReachedThreshold={0.2}
            />
          </>
        ) : (
          <EmptyContainer>
            <Icon name="remove" size={64} color="#eee" />
            <EmptyText>Não há medições</EmptyText>
          </EmptyContainer>
        )}
      </Container>
    );
  }
}

export default withHub(EventsScreen);
