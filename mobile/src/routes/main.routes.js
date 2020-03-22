import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Main from '../pages/Main';
import Collector from '../pages/Collector';

const Tab = createBottomTabNavigator();

export default function MainRoutes() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#7159c1',
        inactiveTintColor: '#868181',
      }}>
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarLabel: 'Main',
        }}
      />
      <Tab.Screen name="Collector" component={Collector} />
    </Tab.Navigator>
  );
}
