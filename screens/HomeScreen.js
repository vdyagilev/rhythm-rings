import { AntDesign, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';
import * as React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { REST_VALUE } from '../data_structures/Structs';
import { bpmToMilli, getActivePulses, getDeviceNormFactor, getScreenHeight, loopIncrement, playPulses } from '../Helpers';
import { setEditMode, setIsPlaying } from '../storage/Actions';
import { PlayButton, SetBPMButton, TwoItemButton } from '../ui/Buttons';
import { DefaultPallete } from '../ui/Colors';
import { RhythmVisualizer } from '../ui/Visualizer';
import { DefaultStyling } from './Styles';
import { ChooseRhythmScreen } from './ChooseRhythmScreen'


// TODO: have sounds play simultenously https://forums.expo.io/t/how-to-play-one-sound-file-simultaneously-polyphonically-play-a-sound/54917

// each sound loaded by expo-av is duplicated
// so that we can play the sound polyphonically
export const NUM_REFS_TO_SOUND = 1 // TODO:

class _HomeScreen extends React.Component {  
  // { navigation, dispatch, isPlaying, rhythm, bpm} = props
  constructor(props) {
    super(props)
    this.state = {
      onBeat: 0,
      timerID: -1,
      sounds: [],
      
      // bool indicator for loading sounds
      isLoading: false,

      // launch ChooseRhythmScreen as modal
      showChooseRhythmScreen: false, 
    }
  }
  
  // cache sounds func
  async loadSounds() {
    this.setState({isLoading: true})

    var loadedFiles = [] // used to not load duplicates 

    var loadedSounds = []

    const rings = this.props.rhythm.rings
    for (let i=0; i<rings.length; i++) {
      const ring = rings[i]
      
      for (let j=0; j<ring.beats.length; j++) {
        const pulse = ring.beats[j]

        if (pulse != REST_VALUE) {
          const file = pulse.sound

          if (loadedFiles.indexOf(file) == -1) {
            //  this is the first time, load file and add into keep-track-of-uniques log
            loadedFiles.push(file)

            // add into sounds as easy-to-access file -> sound obj

            // create multiple copies of the sound so we can play it polyphonically
            for (let x=0; x<NUM_REFS_TO_SOUND; x++) {
              const refObj = {
                id: x, 
                file: file, 
                sound: (await Audio.Sound.createAsync(file)).sound, 
                isPlaying: false
              }
              loadedSounds.push(refObj)
            }            
          }
        }
      }
    }
    // save to state
    this.setState({sounds: loadedSounds})
    // done loading, set indicator to false!
    this.setState({isLoading: false}) 
  }

  async unloadSounds() {
    const sounds = this.state.sounds
    for (let i=0; i<sounds.length; i++) {
      sounds[i].sound.unloadAsync()
    }

    // save to state
    this.setState({sounds: []})
  }

  componentDidMount() {
    // Cache all sounds used in current rhythm
    this.loadSounds()
  }


  componentWillUnmount() {
    // stop ticking forward
    this.clearTimer()

    // clear cached sounds
    this.unloadSounds()
  }

  
  // Play button actions
  startGame() {
    this.props.dispatch(setIsPlaying(true))
    this.tick()
  }

  stopGame() {
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
      playPulses.bind(this)(pulsesHappening, this.state.sounds)
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
    this.loadSounds()

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
    const createActionColor = DefaultPallete.stopButton
    const deleteActionColor = DefaultPallete.playButton

    const { navigation, dispatch, isPlaying, rhythm, bpm} = this.props
    
    // When loading return loading indicator
    if (this.state.isLoading) {
      return (
        <View style={  [DefaultStyling.screen, {justifyContent: 'center'}] }>
          <ActivityIndicator style={{alignSelf: 'center'}} size="large" color={DefaultPallete.loadingIndicator} />
        </View>
      )
    }

    return (
      <View style={ DefaultStyling.screen }>

        <View style={styles.info_container}>
          <View style={{ justifyContent: 'space-evenly', alignSelf: 'flex-start', alignItems: 'center', }}>
            <TouchableOpacity style={[styles.iconButton, {paddingBottom: 10, marginLeft: -5}]} onPress={ this.onPressSaveFile.bind(this) }>
              <AntDesign name="addfile" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={ this.toggleChooseRhythmScreenModal.bind(this) }>
              <Ionicons name="library-outline" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
          </View>

          <Text style={styles.rhythm_name}>{rhythm.name}</Text>


          <View style={{alignItems:'center'}}>
            <SetBPMButton />
            <Text style={styles.bpmTitle}>BPM</Text>
          </View>

        </View>

        <RhythmVisualizer rhythm={rhythm} clockhandIdx={ this.state.onBeat } 
          containerStyle={styles.visualizer_container}/>

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
              onPress={this.setMode.bind(this,"new_ring")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircleo" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Ring</Text>}
              onPress={this.setMode.bind(this,"del_ring")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="pluscircle" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text style={styles.button_text}>Add Pulse</Text>}
              onPress={this.setMode.bind(this,"new_pulse")} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircle" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Pulse</Text>}
              onPress={this.setMode.bind(this,"del_pulse")} containerStyle={styles.action_button}
            />
          </View>
        </View>

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
    bpm: state.bpm
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
      paddingTop: 5,
    },
    iconButton: {
    }
    
})
