import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Main from './pages/Main';
import Collector from './pages/Collector';

import MainRoutes from './routes/main.routes';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lunar"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7159c1',
          },
          headerTintColor: '#FFF',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen
          name="Lunar"
          component={MainRoutes}
          options={{title: 'Lunar'}}
        />
        <Stack.Screen
          name="Collector"
          component={Collector}
          options={{title: 'Collector'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
