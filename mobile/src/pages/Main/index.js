import React, {Component} from 'react';
import {Text, Button} from 'react-native';

import '../../config/ReactotronConfig';
import PropTypes from 'prop-types';

import {Container} from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  render() {
    return (
      <Container>
        <Button
          title="Collector"
          onPress={() => this.props.navigation.navigate('Collector')}
        />
        <Text>Lunar - Main</Text>
      </Container>
    );
  }
}
