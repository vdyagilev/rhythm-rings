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

export const SET_BPM = "SET_BPM"
export const setBPM = (bpm) => ({
    type: SET_BPM,
    bpm: bpm
})
