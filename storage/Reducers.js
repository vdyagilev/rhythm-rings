import { DEFAULT_RHYTHM } from "../data_structures/RhythmLibrary";
import { SET_BPM, SET_EDIT_MODE, SET_IS_PLAYING, SET_PULSE_COLOR, SET_PULSE_SOUND, SET_PULSE_VOLUME, SET_RING_COLOR, SET_SELECTED_RHYTHM, SET_SOUND_CACHE } from './Actions';

const initialState = {
    isPlaying: false,   
    selectedRhythm: DEFAULT_RHYTHM,
    bpm: 80,
    soundCache: [],
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_IS_PLAYING:
            return {
                ...state, isPlaying: action.isPlaying
            }
        
        case SET_BPM: 
            return {
                ...state, bpm: action.bpm <= 0 ? 0 : Math.floor(action.bpm) // floor bpm to positive integer
            }
        
        case SET_SELECTED_RHYTHM:
            return {
                ...state, selectedRhythm: action.rhythm
            }
        
        case SET_RING_COLOR:
            return {
                ...state, selectedRhythm: setRingColor(action.color, action.ringID, state.selectedRhythm)
            }

        // UPDATE SINGLE PULSE ACTIONS
        case SET_PULSE_COLOR:
            return {
                ...state, selectedRhythm: setPulseColor(action.color, action.pulseID, state.selectedRhythm)
            }
        case SET_PULSE_SOUND:
            return {
                ...state, selectedRhythm: setPulseSound(action.sound, action.pulseID, state.selectedRhythm)
            }
        case SET_PULSE_VOLUME: 
            return {
                ...state, selectedRhythm: setPulseVolume(action.volume, action.pulseID, state.selectedRhythm)
            }
        
        
        case SET_SOUND_CACHE:
            return {
                ...state, soundCache: action.sounds
            }

        default:
            return state
    }
}

function getPulseByID(pulseID, rhythm) {
    // Find pulse by (hopefully) unique id in a rhythm
    for (let r=0; r < rhythm.rings.length; r++) {
        for (let b=0; b < rhythm.rings[r].beats.length; b++) {
            const restValue = rhythm.rings[r].restValue
            if (rhythm.rings[r].beats[b] != restValue) {
                if (rhythm.rings[r].beats[b]._id == pulseID) {
                    // located
                    return rhythm.rings[r].beats[b]
                }
            }
        }
    }
}

function getRingByID(ringID, rhythm) {
    // Find ring by (hopefully) unique id in a rhythm
    for (let r=0; r < rhythm.rings.length; r++) {
       if (rhythm.rings[r]._id == ringID) {
            // located
           return rhythm.rings[r]
       }
    }
}

function setRingColor(color, ringID, rhythm) {
    getRingByID(ringID, rhythm).color = color
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
} 

function setPulseColor(color, pulseID, rhythm) {
    getPulseByID(pulseID, rhythm).color = color
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
} 
function setPulseSound(sound, pulseID, rhythm) {
    getPulseByID(pulseID, rhythm).sound = sound
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
} 
function setPulseVolume(volume, pulseID, rhythm) {
    getPulseByID(pulseID, rhythm).volume = volume
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
} 

