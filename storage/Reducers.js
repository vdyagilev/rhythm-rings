import { buildRhythmFromJson, DebuggerRhythm } from '../data_structures/RhythmLibrary';
import { ArePulsesEqual } from '../data_structures/Structs';
import { 
    SET_BPM, SET_IS_PLAYING, SET_PULSE_COLOR, SET_PULSE_SOUND,
    SET_PULSE_VOLUME, SET_RING_COLOR, SET_SELECTED_RHYTHM, SET_SOUND_CACHE,
    ADD_RING_TO_RHYTHM, REMOVE_RING_FROM_RHYTHM, ADD_PULSE_TO_RHYTHM, REMOVE_PULSE_FROM_RHYTHM, SAVE_RHYTHM_TO_LIBRARY, DELETE_RHYTHM_FROM_LIBRARY, SET_COLOR_PALLETE, 
} from './Actions';

const initialState = {
    isPlaying: false,   
    selectedRhythm: buildRhythmFromJson(DebuggerRhythm),
    bpm: 80,
    soundCache: [],
    rhythmLibrary: [],
}

// State Getter functions
export const getIsPlaying = state => state.isPlaying
export const getSelectedRhythm = state => state.selectedRhythm
export const getBPM = state => state.bpm
export const getSoundCache = state => state.soundCache 
export const getRhythmLibrary = state => state.rhythmLibrary

// return true if rhythm can be saved to RhythmLibrary uniquely
export function doesRhythmHaveTwin(rhythm, rhythmLibrary) {
    // compare to check same number of rings with same pulses
    var hasTwin = false
    for (let i=0; i<rhythmLibrary.length; i++) {
        const saved = rhythmLibrary[i]
        
        // skip if different number of beats or rings
        if (rhythm.rings.length != saved.rings.length) {
            continue
        }
        if (rhythm.length != saved.length) {
            continue
        }

        // test to see if all pulses are equivalent
        const nRings = rhythm.rings.length
        const nBeats = rhythm.length

        // compare same beats
        var allPulsesEqual = true
        for (let r=0; r<nRings; r++) {
            for (let b=0; b<nBeats; b++) {
                const savedPulse = saved.rings[r].getPulse(b)
                const newPulse = rhythm.rings[r].getPulse(b)
                
                // compare them
                const arePulsesEqual = ArePulsesEqual(savedPulse, newPulse, rhythm.restValue)
                console.log(savedPulse, newPulse, arePulsesEqual)

                if (!arePulsesEqual) {
                    allPulsesEqual = false
                }
                break
            }
        }
        if (allPulsesEqual) {
            hasTwin = true
        }
    }
    return hasTwin
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
        
        case ADD_RING_TO_RHYTHM:
            return {
                ...state, selectedRhythm: addRingToRhythm(action.ringIdx, action.ring, state.selectedRhythm)
            }
        
        case REMOVE_RING_FROM_RHYTHM:
            return {
                ...state, selectedRhythm: removeRingFromRhythm(action.ringID, state.selectedRhythm)
            }
        
        case ADD_PULSE_TO_RHYTHM:
            return {
                ...state, selectedRhythm: addPulseToRhythm(action.ringIdx, action.beatIdx, action.pulse, state.selectedRhythm)
            }
        
        case REMOVE_PULSE_FROM_RHYTHM:
            return {
                ...state, selectedRhythm: removePulseFromRhythm(action.pulseID, state.selectedRhythm)
            }

        case SET_SOUND_CACHE:
            return {
                ...state, soundCache: action.sounds
            }

        case SAVE_RHYTHM_TO_LIBRARY: 
            return {
                ...state, rhythmLibrary: state.rhythmLibrary.concat([action.rhythm])
            }

        case DELETE_RHYTHM_FROM_LIBRARY:
            return {
                ...state, rhythmLibrary: state.rhythmLibrary.filter(rhythm => rhythm.name != action.name)
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

function addRingToRhythm(ringIdx, ring, rhythm) {
    // insert ring into insertIdx, or end if ringIdx > len
    const nRings = rhythm.rings.length
    const insertIdx = (ringIdx > nRings) ? nRings : ringIdx 
    rhythm.rings.splice(insertIdx, 0, ring)
    
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
}

function removeRingFromRhythm(ringID, rhythm) {
    // filter out ring by its ._id property
    rhythm.rings = rhythm.rings.filter(r => r._id != ringID)
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
}

function addPulseToRhythm(ringIdx, beatIdx, pulse, rhythm) {
    // find ring by idx
    const nRings = rhythm.rings.length
    const nBeats = rhythm.length
    for (let ri=0; ri < nRings; ri++) {
        if (ri == ringIdx) {
            // located

            // insert pulse into insertIdx, or end if pulseIdx > beats.length
            const insertIdx = (beatIdx > nBeats) ? nBeats : beatIdx
            rhythm.rings[ri].beats.splice(insertIdx, 0, pulse)
            break
        }
    }
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
}

function removePulseFromRhythm(pulseID, rhythm) {
    const nRings = rhythm.rings.length
    const nBeats = rhythm.length

    for (let r=0; r < nRings; r++) {
        const ring = rhythm.rings[r]
        const restValue = ring.restValue

        // replace pulses with pulseID with restValue
        for (let b=0; b < nBeats; b++) {
            const beat = ring.beats[b]
            // skip rests
            if (beat != restValue) {
                if (beat._id == pulseID) {
                    // match!
                    // replace whatever value it has with restValue
                    rhythm.rings[r].beats[b] = restValue
                }
            }
        }
    }
    return Object.assign({}, rhythm) // return copy to force refresh store !!!
}


export function isRhythmInLibrary(name, library) {
    // return true if there is an rhythm obj with .name == name
    for (let i=0; i<library.length; i++) {
        library[i].name == name
        return true
    }
    return false
}