import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider } from 'react-redux';
import { HomeStackScreen } from './screens/HomeScreen';
import { SettingsStackScreen } from './screens/SettingsScreen';
import { TAB_ICON_SIZE } from './ui/Constants';
import configureStore from './storage/ConfigureStore'
import { PersistGate } from 'redux-persist/integration/react'
import { DefaultPallete } from './ui/Colors';


// init reactotron debugger
if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

// configureStore returns redux store obj and redux-persist persistence obj
// If you are using react, wrap your root component with PersistGate. This delays the rendering of your app's UI until your persisted state has been retrieved and saved to redux. NOTE the PersistGate loading prop can be null, or any react instance, e.g. loading={<Loading />}
const { store, persistor } = configureStore() 


// // RUN THIS TO RESET ALL REDUX_PERSIST SAVED LOCAL DATA
persistor.purge()

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    // Wrap Redux store around app
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator
          >
            <Tab.Screen 
              name="Home" 
              component={HomeStackScreen} 
              options={{tabBarIcon: (focused, color, size) => { return (
                  <FontAwesome5 
                    name="circle-notch" 
                    size={TAB_ICON_SIZE} 
                    color={DefaultPallete.tabBarText} 
              />)
              }}} 
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsStackScreen}
              options={{tabBarIcon: (focused, color, size) => {
                return (
                  <Feather 
                    name="settings" 
                    size={TAB_ICON_SIZE} 
                    color={DefaultPallete.tabBarText} 
              />)
              }}}  
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}