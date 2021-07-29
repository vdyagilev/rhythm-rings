import { AntDesign, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bpmToMilli, getActivePulses, getDeviceNormFactor, loopIncrement, playPulses } from '../Helpers';
import { loadSoundCache, setEditMode, setIsPlaying, unloadSoundCache } from '../storage/Actions';
import { PlayButton, SetBPMButton, TwoItemButton } from '../ui/Buttons';
import { DefaultPallete } from '../ui/Colors';
import { RhythmVisualizer } from '../ui/Visualizer';
import { ChooseRhythmScreen } from './ChooseRhythmScreen';
import { DefaultStyling } from './Styles';

class _HomeScreen extends React.Component {  
  // { navigation, dispatch, isPlaying, rhythm, bpm} = props
  constructor(props) {
    super(props)
    this.state = {
      onBeat: 0,
      timerID: -1,
      mode: "play",
      // which mode we're in. modes = ["play", "add_ring", "del_ring", "add_pulse", "del_pulse"]
      
      // bool indicator for loading sounds
      isLoading: false,

      // launch ChooseRhythmScreen as modal
      showChooseRhythmScreen: false, 
    }
  }
  

  componentDidMount() {
    // Cache all sounds used in current rhythm
    this.props.dispatch( loadSoundCache() )
  }


  componentWillUnmount() {
    // stop ticking forward
    this.clearTimer()

    // clear cached sounds
    this.props.dispatch( unloadSoundCache() )
  }

  
  // Play button actions
  startGame() {
    // set mode back to play mode
    this.setState({mode: "play"})

    this.props.dispatch(setIsPlaying(true))
    this.tick()
  }

  stopGame() {
    // set mode back to play mode
    this.setState({mode: "play"})

    this.props.dispatch(setIsPlaying(false))
    this.clearTimer()
  }

  setMode(mode) {
    this.props.dispatch(setEditMode(mode))
  } 

  // Moving forward in time 
  tick() {
    // fn to execute every tick (and move tick, make the sound, etc.)
    const intervallicFunc = () => {
      // update state to next beat
      this.setState({onBeat: loopIncrement(this.state.onBeat, this.props.rhythm.length-1)})
      
      // play sounds on current beat
      const pulsesHappening = getActivePulses(this.props.rhythm.rings, this.state.onBeat)
      playPulses(pulsesHappening, this.props.sounds)
    }
    
    // save timer fn id
    const timerID = setInterval(intervallicFunc, bpmToMilli(this.props.bpm))
    this.setState({timerID: timerID})
  }

  clearTimer() {
    clearInterval(this.state.timerID)
    this.setState({timerID: -1})
  }

  async openChooseRhythmScreenModal() {
    // stop playing and reset onBeat to 0 
    this.stopGame()
    this.setState({onBeat: 0})

    // show modal
    this.setState({showChooseRhythmScreen: true})
  }

  async closeChooseRhythmScreenModal() {
    // load new sounds
    this.loadSounds.bind(this)()

    // hide modal
    this.setState({showChooseRhythmScreen: false})
  }

  async toggleChooseRhythmScreenModal() {
    if (this.state.showChooseRhythmScreen) {
      this.closeChooseRhythmScreenModal()
    } else {
      this.openChooseRhythmScreenModal()
    }
  }

  onPressSaveFile() {
    // open alert to save custom rhythm with a name
    
    Alert.prompt(
      "Save your Rhythm",
      "What should we call it?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: () => { }}// TODO:  } }
      ]
    );
  }

  render() {
    // Action button styling
    const actionButtonSize = 24*getDeviceNormFactor()
    const createActionColor = DefaultPallete.playButton
    const deleteActionColor = DefaultPallete.stopButton

    const { navigation, dispatch, isPlaying, rhythm, bpm} = this.props
    
    // When loading return loading indicator
    if (this.state.isLoading) {
      return (
        <View style={  [DefaultStyling.screen, {justifyContent: 'center'}] }>
          <ActivityIndicator style={{alignSelf: 'center'}} size="large" color={DefaultPallete.loadingIndicator} />
        </View>
      )
    }

    // Switch between the homescreen modes with different ui's. modes = ["play", "add_ring", "del_ring", "add_pulse", "del_pulse"]
    var backgroundColor = DefaultPallete.background
    var modeHeader 
    var onTouchFn
    switch (this.state.mode) {
      case "play":
        modeHeader = null
        onTouchFn = null
        break

      case "add_ring":
        backgroundColor = DefaultPallete.backgroundAddMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Add Ring</Text>)
        //onTouchFn = // TODO:
        break

      case "del_ring":
        backgroundColor = DefaultPallete.backgroundDelMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Delete Ring</Text>)
        break

      case "add_pulse":
        backgroundColor = DefaultPallete.backgroundAddMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Add Pulse</Text>)
        break

      case "del_pulse":
        backgroundColor = DefaultPallete.backgroundDelMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Delete Pulse</Text>)
        break

      default:
        break
    }

    return (
      <View style={ [DefaultStyling.screen, {backgroundColor: backgroundColor}] }>

        <View style={styles.info_container}>
          <View style={{paddingTop: 10, justifyContent: 'space-evenly', alignSelf: 'flex-start', alignItems: 'center', }}>
            <TouchableOpacity style={[styles.iconButton, {paddingBottom: 10, marginLeft: -5}]} onPress={ this.onPressSaveFile.bind(this) }>
              <AntDesign name="addfile" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={ this.toggleChooseRhythmScreenModal.bind(this) }>
              <Ionicons name="library-outline" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
          </View>

          <Text style={styles.rhythm_name}>{rhythm.name}</Text>


          <View style={{alignItems:'center'}}>
            <Text style={styles.bpmTitle}>BPM</Text>
            <SetBPMButton />
          </View>

        </View>

        <RhythmVisualizer 
          rhythm={rhythm} 
          clockhandIdx={ this.state.onBeat } 
          containerStyle={styles.visualizer_container}
          />

        <PlayButton 
          onPressPlay={ this.startGame.bind(this) }
          onPressStop={ this.stopGame.bind(this) }
          isPlaying={ isPlaying }
        />      
        
        {/* acts as bottom padding for playbutton */}
        <View style={{height: "3%"}}/> 

        <View style={styles.menu_container}>
          <View style={ styles.action_buttons_container }>
            {/* Action Menu is from Top to Bottom: 1. New Ring, 2. Delete Ring, 3. New Pulse, 4. Delete Pulse */}
            <TwoItemButton 
              item1={<AntDesign name="pluscircleo" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text style={styles.button_text}>Add Ring</Text>}
              onPress={() => this.setState({mode: "add_ring"})} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircleo" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Ring</Text>}
              onPress={() => this.setState({mode: "del_ring"})} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="pluscircle" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text style={styles.button_text}>Add Pulse</Text>}
              onPress={() => this.setState({mode: "add_pulse"})} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircle" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Pulse</Text>}
              onPress={() => this.setState({mode: "del_ring"})} containerStyle={styles.action_button}
            />
          </View>
        </View>

        { modeHeader }

        {/* *********** ChooseRhythmScreen Modal *************/}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showChooseRhythmScreen}
          onRequestClose={this.toggleChooseRhythmScreenModal.bind(this)}
        >

          <ChooseRhythmScreen onClose={this.toggleChooseRhythmScreenModal.bind(this)} />

        </Modal>

        {/* *********** ChooseRhythmScreen Modal *************/}

      </View>
    );
  }
}

// Connect View to Redux store
const mapStateToProps = (state, props) => {
  return { 
    isPlaying: state.isPlaying,
    rhythm: state.selectedRhythm,
    bpm: state.bpm,
    sounds: state.soundCache
  }
}
HomeScreen = connect(mapStateToProps)(_HomeScreen)

const HomeStack = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="RHYTHM" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
    modeHeaderText: {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      top: '12%',
      fontSize: 18 * getDeviceNormFactor(),
      fontWeight: '300',
      color: DefaultPallete.modeHeaderText,
    },
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
      paddingVertical: 5*getDeviceNormFactor(),
    },
    action_button: {

    },

    menu_container: {
      height: "10%",
      width: "100%",
      backgroundColor: DefaultPallete.menuBackground,
    },
    info_container: {
      flexDirection: 'row',
      width: '100%', 
      justifyContent: 'space-between',
      padding: 10,
      alignItems: 'center',
      backgroundColor: DefaultPallete.menuBackground,
    },

    // Rhythm Visualizer
    visualizer_container: {
      flex: 1,
      width: '95%', // %5 acts as horizontal margin
      marginVertical: "2.5%",
      // inside visualizer there is also some sizing properties
    // NOTE: inner content is done with absolute positioning due to animation
    },

    rhythm_name: {
      fontSize: 18*getDeviceNormFactor(),
      color: DefaultPallete.rhythmName,
      fontWeight: '500',
    },
    bpmTitle: {
      fontSize: 10 * getDeviceNormFactor(),
      color: DefaultPallete.rhythmName,
      paddingBottom: 5,
    },
    iconButton: {
    }
    
})
