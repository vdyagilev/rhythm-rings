import { Audio } from "expo-av"

export const SET_COLOR_PALLETE = "SET_COLOR_PALLETE"
export const setColorPallete = (pallete) => ({
    type: SET_COLOR_PALLETE,
    pallete: pallete,
})

export const SET_IS_PLAYING = "SET_IS_PLAYING"
export const setIsPlaying = (isPlaying) => ({
    type: SET_IS_PLAYING,
    isPlaying: isPlaying
})

export const SET_BPM = "SET_BPM"
export const setBPM = (bpm) => ({
    type: SET_BPM,
    bpm: bpm
})

export const SET_SELECTED_RHYTHM = "SET_SELECTED_RHYTHM"
export const setSelectedRhythm = (rhythm) => ({
    type: SET_SELECTED_RHYTHM,
    rhythm: rhythm
})

export const SET_PULSE_VOLUME = "SET_PULSE_VOLUME"
export const setPulseVolume = (pulseID, volume) => ({
    type: SET_PULSE_VOLUME,
    pulseID: pulseID,
    volume: volume,
})

export const SET_PULSE_COLOR = "SET_PULSE_COLOR"
export const setPulseColor = (pulseID, color) => ({
    type: SET_PULSE_COLOR,
    pulseID: pulseID,
    color: color,
})

export const SET_PULSE_SOUND = "SET_PULSE_SOUND"
export const setPulseSound = (pulseID, sound) => ({
    type: SET_PULSE_SOUND,
    pulseID: pulseID,
    sound: sound,
})

export const SET_RING_COLOR = "SET_COLOR_RING"
export const setRingColor = (ringID, color) => ({
    type: SET_RING_COLOR,
    ringID: ringID,
    color: color
})

export const SET_SOUND_CACHE = "SET_SOUND_CACHE"
export const setSoundCache = (sounds) => ({
    type: SET_SOUND_CACHE,
    sounds: sounds
})

export function setPulseSoundAndCacheIt(pulseID, sound) {
    return async (dispatch, getState) => {
        dispatch(addSoundFileCache(sound))
        dispatch(setPulseSound(pulseID, sound))
    }
}

export function addSoundFileCache (soundFile) {
    return async (dispatch, getState) => {
        const { sound } = await Audio.Sound.createAsync(soundFile)
        const refObj = {
            id: NUM_REFS_TO_SOUND+1, 
            file: soundFile, 
            sound: sound, 
            isPlaying: false
        }
        // get old soundCache and concat new sound
        var { soundCache } = getState() 
        soundCache = soundCache.concat([refObj])

        dispatch( setSoundCache( soundCache ) )
    }
}


// each sound loaded by expo-av is duplicated
// so that we can play the sound polyphonically
export const NUM_REFS_TO_SOUND = 5

export function loadSoundCache() {
    return async (dispatch, getState) => {
        const { selectedRhythm } = getState()
        const rhythm = selectedRhythm

        var loadedFiles = [] // used to not load duplicates 
        var loadedSounds = []

        const rings = rhythm.rings
        for (let i=0; i<rings.length; i++) {
        const ring = rings[i]
        
            for (let j=0; j<ring.beats.length; j++) {
                const pulse = ring.beats[j]

                if (pulse != ring.restValue) {
                const file = pulse.sound

                if (loadedFiles.indexOf(file) == -1) {
                    //  this is the first time, load file and add into keep-track-of-uniques log
                    loadedFiles.push(file)

                    // add into sounds as easy-to-access file -> sound obj

                    // create multiple copies of the sound so we can play it polyphonically
                    for (let x=0; x<NUM_REFS_TO_SOUND; x++) {
                        const { sound } = await Audio.Sound.createAsync(file)
                        const refObj = {
                            id: x, 
                            file: file, 
                            sound: sound, 
                            isPlaying: false
                        }
                        loadedSounds.push(refObj)
                    }            
                }
                }
            }
        }
        // once its ready send to redux store
        dispatch( setSoundCache(loadedSounds) )
    }
}

export function unloadSoundCache() {
    return async (dispatch, getState) => {
        const { soundCache } = getState()
        for (let i=0; i<soundCache.length; i++) {
            // unload each file
            await soundCache[i].sound.unloadAsync()
        }
    
        // save to state empty list
        dispatch( setSoundCache([]) )
    }
}

export const ADD_RING_TO_RHYTHM = "ADD_RING_TO_RHYTHM"
export const addRingToRhythm = (ringIdx, ring) => ({
    type: ADD_RING_TO_RHYTHM,
    ringIdx: ringIdx,
    ring: ring
})

export const REMOVE_RING_FROM_RHYTHM = "REMOVE_RING_FROM_RHYTHM"
export const removeRingFromRhythm = (ringID) => ({
    type: REMOVE_RING_FROM_RHYTHM,
    ringID: ringID
})

export const ADD_PULSE_TO_RHYTHM = "ADD_PULSE_TO_RHYTHM"
export const addPulseToRhythm = (ringIdx, beatIdx, pulse) => ({
    type: ADD_PULSE_TO_RHYTHM,
    ringIdx: ringIdx,
    beatIdx: beatIdx,
    pulse: pulse
})

export const REMOVE_PULSE_FROM_RHYTHM = "REMOVE_PULSE_FROM_RHYTHM"
export const removePulseFromRhythm = (pulseID) => ({
    type: REMOVE_PULSE_FROM_RHYTHM,
    pulseID: pulseID
})

export const SAVE_RHYTHM_TO_LIBRARY = "SAVE_RHYTHM_TO_LIBRARY"
export const saveRhythmToLibrary = (rhythm) => ({
    type: SAVE_RHYTHM_TO_LIBRARY,
    rhythm: rhythm,
})

export const DELETE_RHYTHM_FROM_LIBRARY = "DELETE_RHYTHM_FROM_LIBRARY"
export const deleteRhythmFromLibrary = (name) => ({
    type: DELETE_RHYTHM_FROM_LIBRARY,
    name: name,
})