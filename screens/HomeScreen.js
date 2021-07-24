import { Button, StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { setIsPlaying, setEditMode } from '../storage/Actions';
import { connect } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import { DefaultStyling } from './Styles'
import { getDeviceHeight, getDeviceWidth } from '../Helpers';
import { LBG2, RED1 } from '../ui/Colors';
import { GOLDEN_RATIO } from '../ui/Properties';
import { PlayButton, TwoItemButton } from '../ui/Buttons';


function HomeScreen({ navigation, isPlaying, dispatch}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'}
    ]);

    // Play button actions
    const startGame = () => {
      dispatch(setIsPlaying(true))
    }

    const stopGame = () => {
      dispatch(setIsPlaying(false))
    }

    const setMode = (mode) => {
      dispatch(setEditMode(mode))
    } 
    
    // Action button styling
    const actionButtonSize = 25
    const createActionColor = 'green'
    const deleteActionColor = 'red'

    return (
      <View style={ DefaultStyling.screen }>
          <View style={{flex: 1, }}></View>

          <View style={ styles.action_buttons_container }>
            {/* Action Menu is from Top to Bottom: 1. New Ring, 2. Delete Ring, 3. New Pulse, 4. Delete Pulse */}
            <TwoItemButton 
              item1={<AntDesign name="pluscircleo" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text></Text>}
              onPress={() => setMode("new_ring")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircleo" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text></Text>}
              onPress={() => setMode("del_ring")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="pluscircle" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text></Text>}
              onPress={() => setMode("new_pulse")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircle" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text></Text>}
              onPress={() => setMode("del_pulse")} containerStyle={styles.action_button}
            />
          </View>

          <View style={ styles.play_menu_container }>
              <PlayButton 
                onPressPlay={startGame}
                onPressStop={stopGame}
                isPlaying={ isPlaying }
              />
            </View>
      </View>
    );
}

// Connect View to Redux store
const mapStateToProps = (state, props) => {
  return { 
    isPlaying: state.isPlaying,
  }
}
HomeScreen = connect(mapStateToProps)(HomeScreen)

const HomeStack = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Rhythm Rings" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
    select_menu_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: getDeviceHeight() / 10,
        width: getDeviceWidth() * 1/GOLDEN_RATIO,
    },
    select_menu_text: {

    },
    play_menu_container: {
        height: getDeviceHeight() / 10,
        width: getDeviceWidth(),
        backgroundColor: LBG2,
    },
    action_buttons_container: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: LBG2,
      justifyContent: 'space-around',
    },
    action_button: {},
})
