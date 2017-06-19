import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';
import SettingScreen from './screens/SettingScreen';
import DetailScreen from './screens/DetailScreen';

export default StackNavigator({
  welcome: {
    screen: WelcomeScreen,
  },
  login: {
    screen: LoginScreen,
  },
  index: {
    screen: IndexScreen,
  },
  setting: {
    screen: SettingScreen,
  },
  detail: {
    screen: DetailScreen,
  },
}, {
  initialRouteName: 'welcome',
});

