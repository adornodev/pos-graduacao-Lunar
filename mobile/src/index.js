import React, {Component} from 'react';
import './config/ReactotronConfig';
import Routes from './routes';
import {StatusBar} from 'react-native';

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
        <Routes />
      </React.Fragment>
    );
  }
}
