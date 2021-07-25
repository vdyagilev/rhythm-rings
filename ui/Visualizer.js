import React from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { connect } from 'react-redux';
import { REST_VALUE } from '../data_structures/Structs';
import { getDeviceNormFactor, getPosOnCircle, getViewHeight, getViewWidth, rotateAroundCentre } from '../Helpers';
import { setOnBeat } from '../storage/Actions';
import { DefaultPallete } from './Colors';
import { CLOCKHAND_WIDTH, PULSE_RADIUS, RING_INNERMOST_DIST, RING_SHIFT_DIST, RING_WIDTH } from './Constants';
import { CircleView } from './Shapes';

// Visualizer for the game
function rhythmVisualizer(props) {
    const { rhythm, containerStyle, clockhandIdx } = props;
    
    // unpack our struct 
    const {rings, length} = rhythm 

    // render rings
    const innerColor = DefaultPallete.background
    const drawnRings = rings.map((r, i) => 
        // Draw series of concentric rings, starting from innermost ring and extending outwards by shiftDist 
        <RingView beats={r.beats} radius={(i * RING_SHIFT_DIST) + RING_INNERMOST_DIST} width={RING_WIDTH} ringColor={r.color} innerColor={innerColor}/>
    )

    // calculate position of clockhand tip (what beat its on)
    const horizMidpoint = getViewWidth()/2
    const vertMidpoint = getViewHeight()/2
    const ringLeft = horizMidpoint - RING_INNERMOST_DIST - RING_WIDTH
    const playButtonHeight = getViewHeight()*(0.03)+40 + (20 * getDeviceNormFactor()) // padding
    const ringTop = vertMidpoint - RING_INNERMOST_DIST - 1.8*playButtonHeight 

    const firstPos = {X: ringLeft + RING_INNERMOST_DIST, Y: ringTop - (RING_INNERMOST_DIST/2)}
    const ringCenter = {X: ringLeft + RING_INNERMOST_DIST, Y: ringTop + RING_INNERMOST_DIST}

    const clockhandTipXY = getPosOnCircle(length, clockhandIdx, firstPos, ringCenter)

    return (
        <View style={[containerStyle, {}]}>
            { drawnRings.reverse() }

            <Svg height="100%" width="100%">
                <Line 
                    x1={ringCenter.X} y1={ringCenter.Y} x2={clockhandTipXY.X} y2={clockhandTipXY.Y} 
                    stroke={DefaultPallete.clockHand} strokeWidth={CLOCKHAND_WIDTH} 
                />
            </Svg>
    
        </View>
    );
}

function RingView(props) {
    const { radius, width, ringColor, innerColor, beats } = props

    // calculate absolute position to draw (left, top coord)
    const horizMidpoint = getViewWidth()/2
    const vertMidpoint = getViewHeight()/2
    
    const ringLeft = horizMidpoint - radius - width
    const playButtonHeight = getViewHeight()*(0.03)+40 + (20 * getDeviceNormFactor()) // padding
    const ringTop = vertMidpoint - radius - 1.8*playButtonHeight 
    
    // render pulses (every beat is either a rest or a pulse)
    const firstPulsePos = {X: radius, Y: PULSE_RADIUS/2-width/4}
    const ringCenter = {X: radius, Y: radius}
    
    // console.log("Ring Center: ", ringCenter)
    // console.log("First Pulse Pos: ", firstPulsePos, "\n")
    // console.log("RingLeft, Ring Top", ringLeft, ringTop)
    // console.log("Screen width: ", getScreenWidth() )
    // console.log("Window width: ", getViewWidth(), "\n\n\n")

    var pulses = []
    for (let beatIdx=0; beatIdx<beats.length; beatIdx++) {
        if (beats[beatIdx] != REST_VALUE) {
            // render PulseView from Pulse Struct
            const pulse = beats[beatIdx]
            const pulseView = (
            <PulseView 
                radius={PULSE_RADIUS} color={pulse.color}
                rotateAroundXY={ringCenter} fromXY={firstPulsePos}
                ringPos={beatIdx} ringLen={beats.length}
            />)

            pulses.push(pulseView)
        }
    }

    return (
        // Visible Circle
        <CircleView style={{
                borderRadius: radius, width: radius*2, height: radius*2, 
                backgroundColor: ringColor, 
                alignItems: 'center', justifyContent: 'center', 
                position: 'absolute',
                left: ringLeft, top: ringTop,
            }}>
            {/* Inner circle (so that Visible circle is just a Stroke (borderline))  */}
            <CircleView style={{width: (radius-width)*2, 
                height: (radius-width)*2, backgroundColor: innerColor}}/>

            {/* Draw pulses ontop of ring */}
            { pulses }

        </CircleView>
    )
}

function PulseView(props) {
    const { radius, color, rotateAroundXY, fromXY, ringPos, ringLen  } = props

    // calculate the absolute position of dot on the ring, by rotating around ring's centre
    // to its ringPos in ringLen
    const { X, Y } = getPosOnCircle(ringLen, ringPos, fromXY, rotateAroundXY)

    return (
        <CircleView style={{
            width: radius*2, height: radius*2, backgroundColor: color,
            // absolute positioning with calculated coords
            position: 'absolute', left: X - radius, top: Y - radius, 
        }}>
        </CircleView>
    )
}

// Connect View to Redux store
const mapStateToProps = (state, props) => {
    return { 
      isPlaying: state.isPlaying,
      rhythm: state.selectedRhythm,
    }
}
export const RhythmVisualizer = connect(mapStateToProps)(rhythmVisualizer)
  

