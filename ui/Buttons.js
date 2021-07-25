import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getDeviceNormFactor, getScreenWidth } from '../Helpers';
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
    <Pressable style={[styles.play_button, {backgroundColor: backgroundColor}]} onPress={onPress}>
      { buttonIcon }
    </Pressable>
  );
}

export function TwoItemButton(props) {
  // Horizontally spaced two item button
  const { item1, item2, onPress, containerStyle} = props;

  return (
    <Pressable style={[styles.icon_text_button,  containerStyle]} onPress={onPress}>
      <View style={{flex: 1,  alignItems: 'center', justifyContent: 'space-between',}}>
        {item1}
        {item2}
      </View>
    </Pressable>
  );
}

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
});