import React, {Component} from 'react';
import './config/ReactotronConfig';
import 'react-native-get-random-values';
import Routes from './routes';
//import {StatusBar} from 'react-native';

export default class App extends Component {
  // <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
  render() {
    return (
      <React.Fragment>
        <Routes />
      </React.Fragment>
    );
  }
}
