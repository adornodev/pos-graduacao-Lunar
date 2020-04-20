import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src';
import Hub from './src/Hub';

//import Fedx from "./Fedx";

// App Globals Setup
window.Hub = new Hub();

//new Fedx().build(window.Hub);

AppRegistry.registerComponent(appName, () => App);
