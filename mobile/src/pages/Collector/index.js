import React, {Component} from 'react';
import {Text} from 'react-native';

import '../../config/ReactotronConfig';
import PropTypes from 'prop-types';

import {Container} from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Collector extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  render() {
    return (
      <Container>
        <Text>Lunar - Collector</Text>
      </Container>
    );
  }
}
