import React from 'react';
import './config/ReactotronConfig';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MeasuresScreen from './pages/Measures';
import EventsScreen from './pages/Events';
import SettingsScreen from './pages/Settings';

import {MapScreen} from './screens';

const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: true,
          activeTintColor: '#7159c1',
          inactiveTintColor: '#868181',
        }}
        screenOptions={{headerMode: 'none'}}>
        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={{
            tabBarIcon: () => (
              <FontAwesome5 name="book" size={24} color="#CDCCCE" />
            ),
          }}
        />

        <Tab.Screen
          name="Measures"
          component={MeasuresScreen}
          options={{
            tabBarIcon: () => (
              <FontAwesome5 name="database" size={24} color="#CDCCCE" />
            ),
          }}
        />

        <Tab.Screen
          name="Mapping"
          component={MapScreen}
          options={{
            tabBarIcon: () => (
              <FontAwesome5 name="map-marked" size={24} color="#CDCCCE" />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => (
              <FontAwesome5 name="ellipsis-h" size={24} color="#CDCCCE" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
