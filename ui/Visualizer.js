import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Svg, { Line } from 'react-native-svg';
import { connect } from 'react-redux';
import { BassSounds, DrumSounds, MajorChords, MinorChords, NoteSounds } from '../data_structures/Sounds';
import { getCommonProperty, getCommonRingProperty, getDeviceNormFactor, getPosOnCircle, getViewHeight, getViewWidth } from '../Helpers';
import { DefaultStyling } from '../screens/Styles';
import { addSoundFileCache, setPulseColor, setPulseSound, setPulseSoundAndCacheIt, setPulseVolume, setRingColor } from '../storage/Actions';
import { DefaultPallete } from './Colors';
import { CLOCKHAND_WIDTH, LONGPRESS_LENGTH, PULSE_RADIUS, RING_INNERMOST_DIST, RING_SHIFT_DIST, RING_WIDTH } from './Constants';
import { CircleView } from './Shapes';

// Visualizer for the game
class rhythmVisualizer extends React.Component {
    constructor(props) {
        super(props)

        // setting up ui properties
        this.playButtonHeight = getViewHeight()*(0.03)+40 + (20 * getDeviceNormFactor()) // padding
        this.horizMidpoint = getViewWidth()/2
        this.vertMidpoint = getViewHeight()/2
    }
    

    renderRings() {
        const { dispatch } = this.props;
        const {rings, length} = this.props.rhythm 
        const innerColor = DefaultPallete.background

        return rings.map((r, i) => 
            // Draw series of concentric rings, starting from innermost ring and extending outwards by shiftDist 
            <RingView 
                key={i} 
                radius={(i * RING_SHIFT_DIST) + RING_INNERMOST_DIST} 
                width={RING_WIDTH} 
                innerColor={innerColor}

                ringColor={r.color} 
                onUpdateRingColor={color => dispatch( setRingColor(r._id, color) )}
                pulseCommonColor={ getCommonRingProperty(r, p => p.color) }
                onUpdateCommonColor={ color => {r.beats.map(b => b != r.restValue ? dispatch( setPulseColor(b._id, color)) : {}) } }
                pulseCommonVolume={ getCommonRingProperty(r, p => p.volume) }
                onUpdateCommonVolume={ volume => {r.beats.map(b => b != r.restValue ? dispatch( setPulseVolume(b._id, volume)) : {}) }  }
                pulseCommonSound={ getCommonRingProperty(r, p => p.sound) }
                onUpdateCommonSound={ sound => {r.beats.map(b => b != r.restValue ? dispatch( setPulseSound(b._id, sound)) : {}) }  }
            />
        )
    }

    renderPulses() {
        const { dispatch } = this.props

        const {rings, length} = this.props.rhythm

        // render pulses (every beat is either a rest or a pulse)
        const ringLeft = this.horizMidpoint - RING_INNERMOST_DIST - RING_WIDTH
        const ringTop = this.vertMidpoint - RING_INNERMOST_DIST - 1.8*this.playButtonHeight 
        const ringCenter = {X: ringLeft + RING_INNERMOST_DIST, Y: ringTop + RING_INNERMOST_DIST}

        const firstPulsePos = {X: ringCenter.X, Y: ringTop+PULSE_RADIUS/3}

        var views = []
        for (let ri = 0; ri < rings.length; ri++){
            const ring = rings[ri]

            for (let bi=0; bi < ring.length; bi++){
                const beat = ring.beats[bi]

                if (beat != ring.restValue) {
                    const fromPos = Object.assign({}, firstPulsePos) // copy first pos
                    fromPos.Y -= ri*(RING_SHIFT_DIST) // add to Y value ring widths
                    const view = (
                    <PulseView 
                        key={ri*100 + bi}
                        radius={PULSE_RADIUS} 
                        rotateAroundXY={ringCenter} 
                        fromXY={fromPos}
                        ringPos={bi} 
                        ringLen={ring.length}
                        color={beat.color}
                        onUpdateColor={ color => dispatch( setPulseColor(beat._id, color))  }
                        volume={beat.volume}
                        onUpdateVolume={ vol => dispatch( setPulseVolume(beat._id, vol) )}
                        sound={beat.sound}
                        onUpdateSound={ sound => dispatch( setPulseSoundAndCacheIt(beat._id, sound))}     
                    />
                    )
                    views.push(view)
                }
            }
        }
        return views
    }

    renderClockhand() {
        // render clockhand
        // calculate position of clockhand tip (what beat its on)
        const { clockhandIdx, rhythm } = this.props;
        const {rings, length} = rhythm 

        const ringLeft = this.horizMidpoint - RING_INNERMOST_DIST - RING_WIDTH
        const ringTop = this.vertMidpoint - RING_INNERMOST_DIST - 1.8*this.playButtonHeight 
        const ringCenter = {X: ringLeft + RING_INNERMOST_DIST, Y: ringTop + RING_INNERMOST_DIST}

        const firstPos = {
            X: ringLeft + RING_INNERMOST_DIST, 
            Y: ringTop + (rings.length+1)*(RING_WIDTH+RING_SHIFT_DIST) - 20*getDeviceNormFactor()
        }
        const clockhandTipXY = getPosOnCircle(length, (length/2) + clockhandIdx, firstPos, ringCenter)

        return (
            <Svg height="100%" width="100%">
                <Line 
                    x1={ringCenter.X} y1={ringCenter.Y} x2={clockhandTipXY.X} y2={clockhandTipXY.Y} 
                    stroke={DefaultPallete.clockHand} strokeWidth={CLOCKHAND_WIDTH} 
                />
            </Svg>
        )
    }

    renderClockfaceLabels() {
        // render clockface numbers (beats and +'s)
        const {rings, length} = this.props.rhythm 

        const ringLeft = this.horizMidpoint - RING_INNERMOST_DIST - RING_WIDTH
        const ringTop = this.vertMidpoint - RING_INNERMOST_DIST - 1.8*this.playButtonHeight 
        const ringBot = this.vertMidpoint + RING_INNERMOST_DIST - 1.8*this.playButtonHeight 
        const ringCenter = {X: ringLeft + RING_INNERMOST_DIST, Y: ringTop + RING_INNERMOST_DIST}

        const firstLabelPos = {X: ringCenter.X, Y: ringBot - (rings.length+1)*(2*RING_WIDTH+RING_SHIFT_DIST)+(40*getDeviceNormFactor())} // first label at the top
        
        var views = []
        for (let i=0; i<length; i++) {
            const { X, Y } = getPosOnCircle(length, i, firstLabelPos, ringCenter)
            // draw a text label for each half step. Integer on even num "+" on odd,
            if (i % 2 == 0) {
                views.push((<Text key={i} style={[styles.clockfaceBeatNum, {position: 'absolute', left: X, top: Y}]}>{(i/2)+1}</Text>))
            } else {
                views.push((<Text key={i} style={[styles.clockfaceBeatNum, {position: 'absolute', left: X, top: Y}]}>+</Text>))
            }
        }
        return views
    }
 
    render() {
        const { containerStyle } = this.props;
        
        return (
            <View style={[containerStyle,]}>
                {/* the -15% marginTop will center the visualizer inside parent */}
                <View style={{marginTop: -this.playButtonHeight + 20*getDeviceNormFactor()}}> 
                    {/* DRAW RINGS */}
                    { this.renderRings().reverse() }
                    
                    {/* DRAW CLOCKFACE DETAILS (BEAT NUMS) */}
                    { this.renderClockfaceLabels() }

                    {/* DRAW PULSES */}
                    { this.renderPulses() }

                </View>

                {/* DRAW CLOCKHAND */}
                { this.renderClockhand() }
        
            </View>
        );
    }
}

function RingView(props) {
    const { radius, width, ringColor, innerColor } = props

    // popup menu consts
    const { onUpdateRingColor, pulseCommonColor, onUpdateCommonColor, pulseCommonVolume, onUpdateCommonVolume, pulseCommonSound, onUpdateCommonSound  } = props

    // calculate absolute position to draw (left, top coord)
    const horizMidpoint = getViewWidth()/2
    const vertMidpoint = getViewHeight()/2 

    const ringLeft = horizMidpoint - radius - width
    const playButtonHeight = getViewHeight()*(0.03)+40 + (20 * getDeviceNormFactor()) // padding
    const ringTop = vertMidpoint - radius - 1.8*playButtonHeight 
    
    // Popup menu variables
    const [ menuVisible, setMenuVisible ] = useState(false)

    return (
        // Visible Circle
        <CircleView style={{
                borderRadius: radius, width: radius*2, height: radius*2, 
                backgroundColor: ringColor, 
                alignItems: 'center', justifyContent: 'center', 
                position: 'absolute',
                left: ringLeft, top: ringTop,
            }}>
            <TouchableOpacity
                delayLongPress={LONGPRESS_LENGTH}
                onLongPress={() => setMenuVisible(!menuVisible)}>

                    <View style={{ borderRadius: radius, width: radius*2, height: radius*2, 
                    position: 'absolute', left: -radius, top: -width}}/>

            </TouchableOpacity>
            
            {/* Inner circle (so that Visible circle is just a Stroke (borderline))  */}
            <View style={{borderRadius: radius, width: (radius-width)*2, 
                height: (radius-width)*2, backgroundColor: innerColor}}/>

            {/************ Edit Pulse popup modal **********/}
            
            <PopupMenu containerStyle={styles.popupMenu} isVisible={menuVisible} onClose={() => setMenuVisible(false)}>

                <Text style={styles.popupMenuText}>Ring Setup</Text>

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>

                    <Text style={styles.settingText}>Color</Text>
                    <ChooseColorView 
                        containerStyle={[styles.settingItem, {
                        paddingVertical: 5,
                        width: getViewWidth()*0.8 // use real-value for ScrollView to work
                        }]} 
                        onChoose={c => onUpdateRingColor(c)} 
                        selectedColor={ringColor} 
                    />
                </View>

                <Text style={styles.popupMenuSecondaryText}>Setup Ring Pulses</Text>

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Color</Text>
                    <ChooseColorView 
                        containerStyle={[styles.settingItem, {
                        paddingVertical: 5,
                        width: getViewWidth()*0.8 // use real-value for ScrollView to work
                        }]} 
                        onChoose={c => onUpdateCommonColor(c)} 
                        selectedColor={pulseCommonColor} 
                        noShading={true}
                    />
                </View>

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Volume</Text>
                    <Slider
                        onSlidingComplete={vol => onUpdateCommonVolume(vol)}
                        minimumValue={0}
                        maximumValue={1}
                        value={pulseCommonVolume}
                        step={0.1}
                        style={styles.settingItem}
                        minimumTrackTintColor={DefaultPallete.sliderBefore}
                        maximumTrackTintColor={DefaultPallete.sliderAfter}
                    />
                </View>
                
                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Sound</Text>
                    <ChooseSoundView 
                        containerStyle={[styles.settingItem, {
                        width: getViewWidth()*0.64 // use real-value for react-native-picker to be proper width
                        }]} 
                        onChoose={(s) => onUpdateCommonSound(s) } 
                        selectedSound={pulseCommonSound} 
                    />
                </View>
                
            </PopupMenu>

            {/************ Edit Pulse popup modal **********/}

        </CircleView>
    )
}

function PulseView(props) {
    const [ menuVisible, setMenuVisible ] = useState(false)

    const { radius, rotateAroundXY, fromXY, ringPos, ringLen, color, onUpdateColor, volume, onUpdateVolume, sound, onUpdateSound  } = props

    // calculate the absolute position of dot on the ring, by rotating around ring's centre
    // to its ringPos in ringLen
    const { X, Y } = getPosOnCircle(ringLen, ringPos, fromXY, rotateAroundXY)
    
    return (
        
        <CircleView style={{
            width: radius*2, height: radius*2, backgroundColor: color,
            // absolute positioning with calculated coords
            position: 'absolute', left: X - radius, top: Y - radius, 
        }}>
            <TouchableOpacity
            delayLongPress={LONGPRESS_LENGTH}
            onLongPress={() => setMenuVisible(!menuVisible)}>
                <View style={{borderRadius: radius, width: radius*2, height: radius*2,}}/>
            </TouchableOpacity>

            {/************ Edit Pulse popup modal **********/}
            
            <PopupMenu containerStyle={styles.popupMenu} isVisible={menuVisible} onClose={() => setMenuVisible(false)}>

                <Text style={styles.popupMenuText}>Pulse Setup</Text>
                
                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Color</Text>
                    <ChooseColorView 
                        containerStyle={[styles.settingItem, {
                        paddingVertical: 5,
                        width: getViewWidth()*0.8 // use real-value for ScrollView to work
                        }]} 
                        onChoose={c => onUpdateColor(c)} 
                        selectedColor={color} 
                    />
                </View>

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Volume</Text>
                    <Slider
                        onSlidingComplete={vol => onUpdateVolume(vol)}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        step={0.1}
                        style={styles.settingItem}
                        minimumTrackTintColor={DefaultPallete.sliderBefore}
                        maximumTrackTintColor={DefaultPallete.sliderAfter}
                    />
                </View>
                
                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.settingText}>Sound</Text>
                    <ChooseSoundView 
                        containerStyle={[styles.settingItem, {
                        width: getViewWidth()*0.64 // use real-value for react-native-picker to be proper width
                        }]} 
                        onChoose={(s) => onUpdateSound(s) } 
                        selectedSound={sound} 
                    />
                </View>
                
                
                
            </PopupMenu>

            {/************ Edit Pulse popup modal **********/}

        </CircleView>
    )
}

function ChooseColorView(props) {
    const { onChoose, selectedColor, containerStyle, noShading } = props

    const renderColor = (hex) => {
    // render colour as a circle view that is a button and has on-selected shading property
        var shading = (selectedColor == hex) ? 1.0 : 0.3
        if (noShading) {
            shading = 1.0
        }
        return (
            <TouchableOpacity key={hex} onPress={() => onChoose(hex)}> 
                <CircleView style={{marginRight: 10, backgroundColor: 'white', height: 50, width: 50, position: 'absolute'}}/>
                <CircleView style={{marginRight: 10, backgroundColor: hex, height: 50, width: 50, opacity: shading}}/>
            </TouchableOpacity>
        )
    }

    const colors = [ DefaultPallete.jerryGarcia, DefaultPallete.bobWeir, DefaultPallete.pigpen, DefaultPallete.billKruetzmann, DefaultPallete.philLesh, DefaultPallete.robertHunter, DefaultPallete.mickeyHart ]

    return (
        <ScrollView 
            horizontal={true}
            style={containerStyle}
            contentContainerStyle={containerStyle}
        >
            { colors.map(hex => renderColor(hex)) }
        </ScrollView>
    )
}

// HOOK TO HOLD INFO ABOUT FIRST RENDER FOR REACT FUNCTIONAL COMPONENTS
export function useFirstRender() {
    const firstRender = useRef(true);
  
    useEffect(() => {
      firstRender.current = false;
    }, []);
  
    return firstRender.current;
  }

function ChooseSoundView(props) {
    const { onChoose, selectedSound, containerStyle } = props

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedSound)

    // generate items list from all avaliable sounds

    const [items, setItems] = useState([
        {label: 'Drums', value: 'drums'},
        {label: 'Kick', value: DrumSounds.kick, parent: 'drums'},
        {label: 'Snare', value: DrumSounds.snare, parent: 'drums'},
        {label: 'Open Hat', value: DrumSounds.openHat, parent: 'drums'},
        {label: 'Closed Hat', value: DrumSounds.closedHat, parent: 'drums'},
        {label: 'Clap', value: DrumSounds.clap, parent: 'drums'},
        {label:'Ride', value: DrumSounds.ride, parent: 'drums'},
        {label: 'Tambourine', value: DrumSounds.tambourine, parent: 'drums'},
        {label: 'Triangle', value: DrumSounds.triangle, parent: 'drums'},
      
        {label: 'Bass', value: 'bass'},
        {label: '808', value: BassSounds._808, parent: 'bass'},
        {label: 'Muted', value: BassSounds.muted, parent: 'bass'},
        {label: 'Picked', value: BassSounds.picked, parent: 'bass'},

        {label: 'Note', value: 'note'},
        {label: 'Guitar', value: NoteSounds.guitarNote, parent: 'note'},
        {label: 'Piano', value: NoteSounds.pianoNote, parent: 'note'},
        {label: 'Trumpet', value: NoteSounds.trumpetNote, parent: 'note'},

        {label: 'Chords (major)', value: 'chords_maj'},
        {label: 'Guitar', value: MajorChords.guitar, parent: 'chords_maj'},
        {label: 'Piano', value: MajorChords.piano, parent: 'chords_maj'},


        {label: 'Chords (minor)', value: 'chords_min'},
        {label: 'Guitar', value: MinorChords.guitar, parent: 'chords_min'},
        {label: 'Piano', value: MinorChords.piano, parent: 'chords_min'},

      ]);
    
    return (
        <DropDownPicker
            categorySelectable={false}
            containerStyle={containerStyle}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={ign => onChoose(value)}
            setItems={setItems}
        />
    )
}

function PopupMenu(props) {
    const { containerStyle, isVisible, onClose } = props

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}

        >
            <View style={styles.popupMenuContainer}>
                <View style={containerStyle}>
                    
                    { props.children }


                    <TouchableOpacity style={DefaultStyling.backButton} onPress={onClose}>
                        <Text style={DefaultStyling.backButtonText}>Back</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    popupMenuContainer: {
        flex: 1, 
        justifyContent: 'flex-end',
    },
    popupMenu: {
        borderTopLeftRadius: 30 * getDeviceNormFactor(),
        borderTopRightRadius: 30 * getDeviceNormFactor(),
        height: '60%',
        width: '100%',
        paddingVertical: '10%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: DefaultPallete.popupMenu
    },
    popupMenuText: {
        fontSize: 22 * getDeviceNormFactor(),
    },
    popupMenuSecondaryText: {
        fontSize: 18 * getDeviceNormFactor(),
        color: DefaultPallete.settingText,
        fontWeight: '300',
    },
    clockfaceBeatNum: {
        fontSize: 23 * getDeviceNormFactor(),
        fontWeight: '300',
        color: DefaultPallete.clockfaceText,
        marginTop: -15,
        marginLeft: -8
    },
    // popup menu
    settingText: {
        fontSize: 16 * getDeviceNormFactor(),
        color: DefaultPallete.settingText,
        alignSelf: 'center',
        width: '30%',
    },
    settingItem: {
        width: '70%',
    },
})

// Connect View to Redux store
const mapStateToProps = (state, props) => {
    return { 
      isPlaying: state.isPlaying,
      rhythm: state.selectedRhythm,
    }
}
export const RhythmVisualizer = connect(mapStateToProps)(rhythmVisualizer)
  

