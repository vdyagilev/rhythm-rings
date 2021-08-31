import { AntDesign, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { createNewRing } from '../data_structures/Structs';
import { bpmToMilli, getActivePulses, getDeviceNormFactor, getViewHeight, getViewWidth, loopIncrement, playPulses } from '../Helpers';
import { addRingToRhythm, loadSoundCache, saveRhythmToLibrary, setIsPlaying, unloadSoundCache } from '../storage/Actions';
import { doesRhythmHaveTwin, getBPM, getIsPlaying, getRhythmLibrary, getSelectedRhythm, getSoundCache, isRhythmInLibrary } from '../storage/Reducers';
import { PlayButton, SetBPMButton, TextButton, TwoItemButton } from '../ui/Buttons';
import { DefaultPallete } from '../ui/Colors';
import { RhythmVisualizer } from '../ui/Visualizer';
import { ChooseRhythmScreen } from './ChooseRhythmScreen';
import { DefaultStyling } from './Styles';
import { PLAY_MODE, ADD_RING_MODE, ADD_PULSE_MODE, DEL_PULSE_MODE, DEL_RING_MODE, GAME_MODES } from './Constants'
import { buildRhythmFromJson, DEFAULT_RHYTHMS_IN_JSON, nameInLibrary } from '../data_structures/RhythmLibrary';

class _HomeScreen extends React.Component {  
  // { navigation, dispatch, isPlaying, rhythm, bpm} = props
  constructor(props) {
    super(props)
    this.state = {
      onBeat: 0,
      timerID: -1,
      mode: PLAY_MODE,
      // which mode we're in. modes = ["play", "add_ring", "del_ring", "add_pulse", "del_pulse"]
      
      // bool indicator for loading sounds
      isLoading: false,

      // launch ChooseRhythmScreen as modal
      showChooseRhythmScreen: false, 
    }
  }
  

  componentDidMount() {
    const { rhythmLibrary, dispatch } = this.props

    // add all default rhythms into rhythm library if they not in yet
    for (let i=0; i<DEFAULT_RHYTHMS_IN_JSON.length; i++) {
      const rhythmJson = DEFAULT_RHYTHMS_IN_JSON[i]
      const rhythm = buildRhythmFromJson(rhythmJson)

      if (!isRhythmInLibrary(rhythm.name, rhythmLibrary)) {
        dispatch( saveRhythmToLibrary(rhythm) )
      }
    }

    // Cache all sounds used in current rhythm
    dispatch( loadSoundCache() )

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
    this.setState({mode: PLAY_MODE})

    this.props.dispatch(setIsPlaying(true))
    this.tick()
  }

  stopGame() {
    // set mode back to play mode
    this.setState({mode: PLAY_MODE})

    this.props.dispatch(setIsPlaying(false))
    this.clearTimer()
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
    this.props.dispatch( loadSoundCache() )

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
    const { dispatch, rhythm, rhythmLibrary } = this.props
    const saveRhythm = () => dispatch( saveRhythmToLibrary(rhythm) )
    
    Alert.prompt(
      "Save your Rhythm",
      "What should we call it?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: (text) => {
          // If we have saved under same name, notify user to supply different name
          if (isRhythmInLibrary(text, rhythmLibrary)){
            Alert.alert(
              "Name Unavailable",
              "There is an existing rhythm under this name!",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            )
          } else {
            // Add it into rhythm library as a new rhythm
            saveRhythm()
          }
        }}
      ]
    );
  }

  render() {
    // Action button styling
    const actionButtonSize = 24*getDeviceNormFactor()
    const createActionColor = DefaultPallete.addButton
    const deleteActionColor = DefaultPallete.delButton

    const { navigation, dispatch, isPlaying, rhythm, rhythmLibrary, bpm} = this.props
    
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
  
    switch (this.state.mode) {
      case PLAY_MODE:
        modeHeader = null
        break

      case DEL_RING_MODE:
        backgroundColor = DefaultPallete.backgroundDelMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Delete Ring</Text>)
        break

      case ADD_PULSE_MODE:
        backgroundColor = DefaultPallete.backgroundAddMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Add Pulse</Text>)
        break

      case DEL_PULSE_MODE:
        backgroundColor = DefaultPallete.backgroundDelMode
        modeHeader = (<Text style={styles.modeHeaderText}>Tap to Delete Pulse</Text>)
        break

      default:
        modeHeader = null
        break
    }

    // only used used for add_ring (as there is no user mode, the button press calls onAddRing())
    const onAddRing = () => {
      const rhythm = this.props.rhythm
      const ring = createNewRing(rhythm.length)
      const outermostIdx = rhythm.rings.length 

      dispatch(  addRingToRhythm(outermostIdx, ring) )  
    }

    // visualier uses real pixel values so pass those bad boys in
    const visualizerDim = {width: getViewWidth(), height: getViewHeight()}

    // if selectedRhythm is directly from library, display its name. 
    // if its edited => custom, display "Custom"

    // TODO: make work 
    const isRhythmNew = !doesRhythmHaveTwin(rhythm, rhythmLibrary)
    const rhythmName = isRhythmNew ? "Custom" : rhythm.name 


    return (
      <View style={ [DefaultStyling.screen, {backgroundColor: backgroundColor}] }>

      { modeHeader ? (
        <View style={[styles.info_container, {flexDirection: 'column'} ]}>
            <TextButton text={"Back"} onPress={() => this.setState({mode: PLAY_MODE})} textStyle={styles.textButton} containerStyle={{flex: 0}}/>
            { modeHeader }
        </View>
      ) : (
        <View style={styles.info_container}>
          
          <View style={{paddingTop: 10, justifyContent: 'space-evenly', alignSelf: 'flex-start', alignItems: 'center', }}>
            <TouchableOpacity style={[styles.iconButton,{paddingBottom: 10, }]} onPress={ this.toggleChooseRhythmScreenModal.bind(this) }>
              <Ionicons name="library-outline" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, ]} onPress={ this.onPressSaveFile.bind(this) }>
              <AntDesign name="addfile" size={28 * getDeviceNormFactor()} color={DefaultPallete.iconButton} />
            </TouchableOpacity>
          </View>

          <Text style={styles.rhythm_name}>{rhythmName}</Text>

          <View style={{alignItems:'center', paddingBottom: 5}}>
            <Text style={styles.bpmTitle}>BPM</Text>
            <SetBPMButton />
          </View>

        </View>        
      ) }

        <RhythmVisualizer 
          rhythm={rhythm} 
          clockhandIdx={ this.state.onBeat } 
          containerStyle={[styles.visualizer_container, visualizerDim]}
          mode={this.state.mode}
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
              onPress={() => {
                this.setState({mode: ADD_RING_MODE}); 
                onAddRing.bind(this)()}
              }
              containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircleo" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Ring</Text>}
              onPress={() => this.setState({mode: DEL_RING_MODE})} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="pluscircle" size={actionButtonSize} color={createActionColor}/>} 
              item2={<Text style={styles.button_text}>Add Pulse</Text>}
              onPress={() => this.setState({mode: ADD_PULSE_MODE})} containerStyle={styles.action_button}
            />
            <TwoItemButton 
              item1={<AntDesign name="minuscircle" size={actionButtonSize} color={deleteActionColor}/>} 
              item2={<Text style={styles.button_text}>Del Pulse</Text>}
              onPress={() => this.setState({mode: DEL_PULSE_MODE})} containerStyle={styles.action_button}
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
    isPlaying: getIsPlaying(state),
    rhythm: getSelectedRhythm(state),
    bpm: getBPM(state),
    sounds: getSoundCache(state),
    rhythmLibrary: getRhythmLibrary(state),
  }
}
HomeScreen = connect(mapStateToProps)(_HomeScreen)

const HomeStack = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="RHYTHM" 
        component={HomeScreen} 
        options={{
          title: 'RHYTHM',
          headerStyle: {
            backgroundColor: DefaultPallete.headerBackground,
          },
          headerTintColor: DefaultPallete.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18 * getDeviceNormFactor(),
            fontWeight: '800',
          },
        }}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  textButton: {
    textDecorationLine: 'underline',
    width: '100%',
    textAlign: 'center',
    fontSize: 16 * getDeviceNormFactor(),
    fontWeight: '300',
    color: DefaultPallete.textButton,
    paddingBottom: 3 * getDeviceNormFactor(),
    paddingTop: 5 * getDeviceNormFactor()
  },
    modeHeaderText: {
      width: '100%',
      paddingVertical: '5%',
      textAlign: 'center',
      fontSize: 22 * getDeviceNormFactor(),
      fontWeight: '500',
      color: DefaultPallete.title,
    },
    action_buttons_container: {
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between',
      padding: 10*getDeviceNormFactor(),
    },
    button_text: {
      color: DefaultPallete.buttonText,
      fontSize: 12 * getDeviceNormFactor(),
      paddingVertical: 5*getDeviceNormFactor(),
      fontWeight: '700',
    },
    action_button: {

    },

    menu_container: {
      height: "10%",
      width: "100%",
      backgroundColor: DefaultPallete.buttonMenuBackground,
    },
    info_container: {
      flexDirection: 'row',
      width: '100%', 
      justifyContent: 'space-between',
      paddingTop: 5,
      paddingHorizontal: 10,
      alignItems: 'center',
      backgroundColor: DefaultPallete.menuBackground,
    },

    // Rhythm Visualizer
    visualizer_container: {
      flex: 1,
      paddingLeft: 10*getDeviceNormFactor()
    },

    rhythm_name: {
      fontSize: 21*getDeviceNormFactor(),
      color: DefaultPallete.rhythmName,
      fontWeight: '700',
    },
    bpmTitle: {
      fontSize: 1 * getDeviceNormFactor(),
      color: DefaultPallete.rhythmName,
      paddingBottom: 5,
      fontSize: 12*getDeviceNormFactor(),
      fontWeight: '600',
    },
    iconButton: {
    }
    
})
