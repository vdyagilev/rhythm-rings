import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { getDeviceNormFactor, getScreenWidth } from '../Helpers';
import { setBPM } from '../storage/Actions';
import { DefaultPallete } from './Colors';

export function PlayButton(props) {
  const { onPressPlay, onPressStop, isPlaying } = props;

  // Flip between Play and Stop mode  
  var backgroundColor
  var buttonIcon
  var onPress
  if (isPlaying){
    backgroundColor = DefaultPallete.stopButton
    buttonIcon = <FontAwesome5 name="pause" size={ 20 * getDeviceNormFactor() } color={DefaultPallete.playButtonText} />
    onPress = onPressStop
  } else {
    backgroundColor = DefaultPallete.playButton
    buttonIcon = <FontAwesome5 name="play" size={ 20 * getDeviceNormFactor()} color={DefaultPallete.playButtonText} />
    onPress = onPressPlay
  }

  return (
    <TouchableOpacity style={[styles.play_button, {backgroundColor: backgroundColor}]} onPress={onPress}>
      { buttonIcon }
    </TouchableOpacity>
  );
}

export function TwoItemButton(props) {
  // Horizontally spaced two item button
  const { item1, item2, onPress, containerStyle} = props;

  return (
    <TouchableOpacity style={[styles.icon_text_button,  containerStyle]} onPress={onPress}>
      <View style={{flex: 1,  alignItems: 'center', justifyContent: 'space-between',}}>
        {item1}
        {item2}
      </View>
    </TouchableOpacity>
  );
}

class _SetBPMButton extends React.Component {
  // button that shows current BPM and has two buttons to increase and decrease BPM
  // const { bpm, dispatch } = props
  constructor(props) {
    super(props)
    this.state = {
      // increase/decrease bpm while holding down button
      intervalID: 0,
      holdTime: 0,
      isGrowing: false,
      
      // number of milliseconds before interval adds to holdTime
      increment:  300,

      // number to add/subtract form bpm every increment timeperiod with exponential weighting based on holdTime
      changeAmount: 1,
    }
  }

  updateButton(plusTime) {
    // update hold time
    const { holdTime, changeAmount, isGrowing, increment } = this.state
    this.setState({holdTime: (holdTime + plusTime)})

    // grow changeAmount as holdTime grows.
    const weightedChangeAmount = changeAmount + (holdTime/1000)

    if (isGrowing) {
       this.updateBPMAdd(+weightedChangeAmount)
    } else {
      this.updateBPMAdd(-weightedChangeAmount)
    }
    
}

  updateBPMAdd(addBpm) {
    // update bpm by changeAmount
    const { dispatch, bpm } = this.props
    dispatch( setBPM( bpm + addBpm ))
  }

  updateBPMSet(newBpm) {
    // update bpm by changeAmount
    const { dispatch } = this.props
    dispatch( setBPM( newBpm ))
  }

  updateBPMByText(text) {
    // Use onChange with TextInput to set bpm with text inputted numbers
    const newBpm = parseInt(text)
    if (newBpm >= 0) {
      this.updateBPMSet( newBpm ) 
    }
  }

  startGrow() {
    const { increment } = this.state
    const id = setInterval( () => this.updateButton(increment), increment)
    this.setState({intervalID: id, isGrowing: true})
  }

  startShrink() {
    const { increment } = this.state
    const id = setInterval( () => this.updateButton(increment), increment)
    this.setState({intervalID: id, isGrowing: false})
  }

  stop(){
    const { intervalID } = this.state
    // reset interval timer
    clearInterval(intervalID)

    // reset state
    this.setState({holdTime: 0, intervalID: 0})
  }

  render() {
    const { holdTime } = this.state
    const { bpm } = this.props
    return (
      <View style={styles.bpm_button}>
        <TouchableOpacity onPress={this.updateBPMAdd.bind(this, 1)} onPressIn={this.startGrow.bind(this)} onPressOut={this.stop.bind(this)}>
          <AntDesign name="caretup" size={16 * getDeviceNormFactor()} color="black" />
        </TouchableOpacity>

        <TextInput 
          onChangeText={this.updateBPMByText.bind(this)} 
          style={styles.bpm_text}>{bpm}
        </TextInput>

        <TouchableOpacity onPress={this.updateBPMAdd.bind(this, -1)} onPressIn={this.startShrink.bind(this)} onPressOut={this.stop.bind(this)}>
          <AntDesign name="caretdown" size={16 * getDeviceNormFactor()} color="black" />
        </TouchableOpacity>
      </View>
  )}
}
// connect button to redux store for bpm and its actions
const mapStateToProps = (state, props) => {
  return { 
    bpm: state.bpm
  }
}
export const SetBPMButton = connect(mapStateToProps)(_SetBPMButton)

const styles = StyleSheet.create({
  // Play Button
  play_button: {
    width: "80%",


    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
    borderRadius: getScreenWidth(),
    elevation: 3,
  },
  // Icon Button
  icon_text_button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
  },
  // BPM button
  bpm_button: {
    alignItems: 'center'
  },
  bpm_text: {

  },
});