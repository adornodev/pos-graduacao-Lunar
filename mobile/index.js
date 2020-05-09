import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src';
import Hub from './src/Hub';

// App Globals Setup
window.Hub = new Hub();

AppRegistry.registerComponent(appName, () => App);
