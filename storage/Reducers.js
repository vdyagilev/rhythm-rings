import { DEFAULT_RHYTHM } from "../data_structures/RhythmLibrary";
import { SET_BPM, SET_EDIT_MODE, SET_IS_PLAYING, SET_SELECTED_RHYTHM } from './Actions';

const initialState = {
    isPlaying: false,   
    editMode: null,
    selectedRhythm: DEFAULT_RHYTHM,
    bpm: 116,
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_IS_PLAYING:
            return {
                ...state, isPlaying: action.isPlaying
            }
        
        case SET_EDIT_MODE:
            return {
                ...state, editMode: action.mode
            }
        
        
        case SET_BPM: 
            return {
                ...state, bpm: action.bpm
            }
        
        case SET_SELECTED_RHYTHM:
            return {
                ...state, selectedRhythm: action.rhythm
            }

        default:
            return state
    }
}