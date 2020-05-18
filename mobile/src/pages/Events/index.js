import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import '../../config/ReactotronConfig';

import {withHub} from '../../Hub';
import {MEASUREMENTS_TO_DISPLAY} from '../../Events';

import cloneDeep from 'lodash/cloneDeep';

import {Lunar} from '../../models/Lunar';
import {isArrayValid} from '../../helpers/ArrayHelper';

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

    this.hubLoadStoredMeasurements = this.hubLoadStoredMeasurements.bind(this);

    props.attach(
      MEASUREMENTS_TO_DISPLAY,
      this.hubLoadStoredMeasurements,
      false
    );
  }

  hubLoadStoredMeasurements = message => {
    const newMessage = message ? cloneDeep(message) : [];

    const objects = Lunar.fromCSVLines(newMessage);

    let paginatedObjects = cloneDeep(objects);

    this.setState({
      measurements: objects,
      displayedMeasurements: paginatedObjects,
    });
  };

  loadStateStoredMeasurements = () => {
    const {page, pageSize} = this.state;
    let {measurements, displayedMeasurements} = this.state;

    const start = page * pageSize;
    const end = page * pageSize + pageSize;

    if (!isArrayValid(measurements)) {
      measurements = [];
    }

    if (!isArrayValid(displayedMeasurements)) {
      displayedMeasurements = [];
    }

    const moreMeasurements = measurements.slice(start, end);

    if (!moreMeasurements.length) {
      this.setState(s => {
        s.displayedMeasurements = [
          ...displayedMeasurements,
          ...moreMeasurements,
        ];
        return s;
      });
    }
  };

  renderItem = ({item}) => {
    return (
      <Item key={item.id} speedBumpId={String(item.speedBumpId)}>
        <Header>
          <Timestamp>
            {DateTimeHelper.ticksToDate(item.accelerometer.timestamp)}
          </Timestamp>
        </Header>
        <Content>
          <AccelerometerContent>
            <AccelerometerValues>
              X: {new String(item.accelerometer.x).substr(0, 6)}
            </AccelerometerValues>
            <AccelerometerValues>
              Y: {new String(item.accelerometer.y).substr(0, 6)}
            </AccelerometerValues>
            <AccelerometerValues>
              Z: {new String(item.accelerometer.z).substr(0, 6)}
            </AccelerometerValues>
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
