import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { getDeviceWidth } from '../Helpers';
import { GREEN1, RED1 } from './Colors';

export function PlayButton(props) {
  const { onPressPlay, onPressStop, isPlaying } = props;

  // Flip between Play and Stop mode  
  var backgroundColor
  var buttonText
  var onPress
  if (isPlaying){
    backgroundColor = RED1
    buttonText = "STOP"
    onPress = onPressStop
  } else {
    backgroundColor = GREEN1
    buttonText = "PLAY"
    onPress = onPressPlay
  }

  return (
    <Pressable style={[styles.play_button, {backgroundColor: backgroundColor}]} onPress={onPress}>
      <Text style={[styles.play_button_text, {backgroundColor: backgroundColor}]}>{buttonText}</Text>
    </Pressable>
  );
}


export function TwoItemButton(props) {
  // Horizontally spaced two item button
  const { item1, item2, onPress, containerStyle } = props;

  return (
    <Pressable style={styles.icon_text_button} onPress={onPress}>
      <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}, containerStyle]}>
        {item1}
        {item2}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Play Button
  play_button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    elevation: 3,
    flex: 1,
  },
  play_button_text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  // Icon Button
  icon_text_button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    elevation: 3,
    flex: 1,
  },
  icon_text_button_text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});