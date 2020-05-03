import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import '../../config/ReactotronConfig';

import {withHub} from '../../Hub';
import {EVENT_TEST} from '../../Events';

import cloneDeep from 'lodash/cloneDeep';

import {Lunar} from '../../models/Lunar';

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

import {DateTimeHelper} from '../../helpers/DateTimeHelper';

class EventsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedMeasurements: [],
      measurements: [],
      page: 0,
      pageSize: 10,
    };

    this.loadHubStoredMeasurements = this.loadHubStoredMeasurements.bind(this);

    props.attach(EVENT_TEST, this.loadHubStoredMeasurements, true);
  }

  loadHubStoredMeasurements = message => {
    console.log('Entrei loadHubStoredMeasurements');
    const {displayedMeasurements, pageSize} = this.state;

    const newMessage = message ? cloneDeep(message) : [];

    const objects = Lunar.fromCSVLines(newMessage);

    let paginatedObjects = [];

    /*
    if (Array.isArray(displayedMeasurements)) {
        paginatedObjects = !displayedMeasurements.length ? objects.slice(0, pageSize) : objects;
    } else {
      paginatedObjects = objects;
    }
    */

    paginatedObjects = objects;

    this.setState(
      {
        measurements: objects,
        displayedMeasurements: paginatedObjects,
      },
      () => {
        //console.log(
        //  `displayedMeasurements: ${this.state.displayedMeasurements}`
        //);
      }
    );
  };

  loadStateStoredMeasurements = () => {
    const {measurements, page, pageSize, displayedMeasurements} = this.state;

    const start = page * pageSize;
    const end = page * pageSize + pageSize;

    const moreMeasurements = measurements.slice(start, end);

    if (!moreMeasurements.length) {
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
    }
  };

  renderItem = ({item}) => {
    console.log(`item: ${Object.entries(item)}`);
    console.log(item.isSpeedBump, typeof(item.isSpeedBump));
    return (
      <Item key={item.id} isSpeedBump={String(item.isSpeedBump)}>
        <Header>
          <Timestamp>{DateTimeHelper.ticksToDate(item.accelerometer.timestamp)}</Timestamp>
        </Header>
        <Content>
          <AccelerometerContent>
            <AccelerometerValues>X: {new String(item.accelerometer.x).substr(0, 6)}</AccelerometerValues>
            <AccelerometerValues>Y: {new String(item.accelerometer.y).substr(0, 6)}</AccelerometerValues>
            <AccelerometerValues>Z: {new String(item.accelerometer.z).substr(0, 6)}</AccelerometerValues>
          </AccelerometerContent>
          <GPSContent>
            <GPSValues>Lat: {item.geolocation.latitude}</GPSValues>
            <GPSValues>Lng: {item.geolocation.longitude}</GPSValues>
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
