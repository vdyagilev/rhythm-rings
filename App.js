import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider } from 'react-redux';
import { HomeStackScreen } from './screens/HomeScreen';
import { SettingsStackScreen } from './screens/SettingsScreen';
import store from './storage/Store';
import { DefaultPallete } from './ui/Colors';
import { TAB_ICON_SIZE } from './ui/Constants';

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    // Wrap Redux store around app
    <Provider store={store}> 
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStackScreen} options={{tabBarIcon: (focused, color, size) => { return (
                <FontAwesome5 name="circle-notch" size={TAB_ICON_SIZE} color={DefaultPallete.tabBarText} /> )
            }}} 
          />
          <Tab.Screen name="Settings" component={SettingsStackScreen}
            options={{tabBarIcon: (focused, color, size) => {
              return (
                <Feather name="settings" size={TAB_ICON_SIZE} color={DefaultPallete.tabBarText} />
              )
            }}}  
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}