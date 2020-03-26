import Reactotron from 'reactotron-react-native';

// '10.0.3.2'
if (__DEV__) {
  const tron = Reactotron.configure({host: '10.0.3.2'})
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
