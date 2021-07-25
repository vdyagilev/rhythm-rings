import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bpmToMilli, getDeviceNormFactor, loopIncrement } from '../Helpers';
import { setEditMode, setIsPlaying } from '../storage/Actions';
import { PlayButton, TwoItemButton } from '../ui/Buttons';
import { DefaultPallete } from '../ui/Colors';
import { RhythmVisualizer } from '../ui/Visualizer';
import { DefaultStyling } from './Styles';



function HomeScreen({ navigation, dispatch, isPlaying, rhythm, bpm}) {  
  // Manage rhythmic clock rotation at BPM update rate
  const [onBeat, setOnBeat] = React.useState(0)
  const [timerFunc, setTimerFunc] = React.useState(null)
  

  useEffect(() => {
    if (timerFunc && isPlaying) {
      // We have come here after a timerFunc refresh (clocktick), and
      // we must launch another one!
      tick()

    }
  })

  const tick = () => {
    // set timer to tick forward intervallically
    const timerID = setTimeout(() => {setOnBeat( loopIncrement(onBeat, rhythm.length-1) )}, bpmToMilli(bpm))
    setTimerFunc(timerID)
  }

  // Play button actions
  const startGame = () => {
    dispatch(setIsPlaying(true))

    tick()
  }

  const stopGame = () => {
    dispatch(setIsPlaying(false))

    clearTimeout(timerFunc)
    setTimerFunc(null)
  }

  const setMode = (mode) => {
    dispatch(setEditMode(mode))
  } 

  // Action button styling
  const actionButtonSize = 24*getDeviceNormFactor()
  const createActionColor = DefaultPallete.stopButton
  const deleteActionColor = DefaultPallete.playButton

  return (
    <View style={ DefaultStyling.screen }>

      <View style={styles.menu_container}>
        <View style={ styles.action_buttons_container }>
          {/* Action Menu is from Top to Bottom: 1. New Ring, 2. Delete Ring, 3. New Pulse, 4. Delete Pulse */}
          <TwoItemButton 
            item1={<AntDesign name="pluscircleo" size={actionButtonSize} color={createActionColor}/>} 
            item2={<Text style={styles.button_text}>Add Ring</Text>}
            onPress={() => setMode("new_ring")} containerStyle={styles.action_button}
          />
          <TwoItemButton 
            item1={<AntDesign name="minuscircleo" size={actionButtonSize} color={deleteActionColor}/>} 
            item2={<Text style={styles.button_text}>Del Ring</Text>}
            onPress={() => setMode("del_ring")} containerStyle={styles.action_button}
          />
          <TwoItemButton 
            item1={<AntDesign name="pluscircle" size={actionButtonSize} color={createActionColor}/>} 
            item2={<Text style={styles.button_text}>Add Pulse</Text>}
            onPress={() => setMode("new_pulse")} containerStyle={styles.action_button}
          />
          <TwoItemButton 
            item1={<AntDesign name="minuscircle" size={actionButtonSize} color={deleteActionColor}/>} 
            item2={<Text style={styles.button_text}>Del Pulse</Text>}
            onPress={() => setMode("del_pulse")} containerStyle={styles.action_button}
          />
        </View>
      </View>

      <RhythmVisualizer rhythm={rhythm} clockhandIdx={onBeat} 
        containerStyle={styles.visualizer_container}/>

      <PlayButton 
        onPressPlay={startGame}
        onPressStop={stopGame}
        isPlaying={ isPlaying }
      />      
      
      {/* acts as bottom padding for playbutton */}
      <View style={{height: "3%"}}/> 

    </View>
  );
}

// Connect View to Redux store
const mapStateToProps = (state, props) => {
  return { 
    isPlaying: state.isPlaying,
    rhythm: state.selectedRhythm,
    bpm: state.bpm
  }
}
HomeScreen = connect(mapStateToProps)(HomeScreen)

const HomeStack = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="RHYTHM" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
    action_buttons_container: {
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between',
      padding: 10,
      paddingTop: 15,
    },
    button_text: {
      color: DefaultPallete.buttonText,
      fontSize: 12 * getDeviceNormFactor(),
    },
    action_button: {
    },

    menu_container: {
      height: "10%",
      width: "100%",
      backgroundColor: DefaultPallete.menuBackground,
    },

    // Rhythm Visualizer
    visualizer_container: {
      flex: 1,
      width: '95%', // %5 acts as horizontal margin
      marginVertical: "2.5%",
      
    // NOTE: inner content is done with absolute positioning due to animation
    },
    
})
