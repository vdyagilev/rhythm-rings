export const SET_GAME_PRESET = "SET_GAME_PRESET"
export const setGamePreset = (preset) => ({
    type: SET_GAME_PRESET,
    preset: preset
})

export const SET_RING_PRESET = "SET_RING_PRESET"
export const setRingPreset = (preset) => ({
    type: SET_RING_PRESET,
    preset: preset
})

export const SET_PULSE_PRESET = "SET_PULSE_PRESET"
export const setPulsePreset = (preset) => ({
    type: SET_PULSE_PRESET,
    preset: preset
})

export const SET_IS_PLAYING = "SET_IS_PLAYING"
export const setIsPlaying = (isPlaying) => ({
    type: SET_IS_PLAYING,
    isPlaying: isPlaying
})

export const SET_EDIT_MODE = "SET_EDIT_MODE"
export const setEditMode = (mode) => ({
    type: SET_EDIT_MODE,
    mode: mode
})

