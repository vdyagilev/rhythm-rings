import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import { HomeStackScreen } from './screens/HomeScreen'
import { SettingsStackScreen } from './screens/SettingsScreen'

import { TAB_BAR_COLOR, TAB_ICON_COLOR, TAB_ICON_SIZE} from './ui/Properties'

import { Provider } from 'react-redux';
import store from './storage/Store'

// creates the bottom button menu 
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // Wrap Redux store around app
    <Provider store={store}> 
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStackScreen} options={{tabBarIcon: (focused, color, size) => { return (
                <FontAwesome5 name="circle-notch" size={TAB_ICON_SIZE} color={TAB_ICON_COLOR} /> )
            }}} 
          />
          <Tab.Screen name="Settings" component={SettingsStackScreen}
            options={{tabBarIcon: (focused, color, size) => {
              return (
                <Feather name="settings" size={TAB_ICON_SIZE} color={TAB_ICON_COLOR} />
              )
            }}}  
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}