import { DEFAULT_GAME_PRESET } from "../data_structures/Presets";
import { SET_IS_PLAYING, SET_GAME_PRESET, SET_EDIT_MODE } from './Actions'

const initialState = {
    gamePreset: DEFAULT_GAME_PRESET,
    isPlaying: false,   
    editMode: null,
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_GAME_PRESET:
            return {
                ...state, gamePreset: action.preset
            }
        // TODO
        // case SET_PULSE_PRESET:
        //     return {
        //         ...state, gamePreset: action.preset
        //     }
        // case SET_GAME_PRESET:
        //     return {
        //         ...state, gamePreset: action.preset
        //     }
        case SET_IS_PLAYING:
            return {
                ...state, isPlaying: action.isPlaying
            }
        
        case SET_EDIT_MODE:
            return {
                ...state, editMode: action.mode
            }
        
        default:
            return state
    }
}