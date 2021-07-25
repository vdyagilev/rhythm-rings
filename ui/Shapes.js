import { View } from 'react-native';
import React from 'react';
import { getViewWidth } from '../Helpers';

export function CircleView(props) {
    const width = getViewWidth()
    return (
        <View style={[{borderRadius: width}, props.style]}>

            {props.children}

        </View>
    )
}