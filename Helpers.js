import { Audio } from 'expo-av';
import { Dimensions, PixelRatio } from 'react-native';

// Dynamic device dimensions
export function getScreenWidth() { return Dimensions.get('screen').width }
export function getScreenHeight() { return Dimensions.get('screen').height }
export function getViewWidth() { return Dimensions.get('window').width }
export function getViewHeight() { return Dimensions.get('window').height }
export function getDeviceNormFactor() { return (Math.sqrt(getScreenWidth()*getScreenHeight())*0.00189) }

// Rotate point around a ring, for counter-clockwise radians
export function rotateAroundCentre(aroundXY, fromXY, radians) {
    // Source: https://math.stackexchange.com/questions/814950/how-can-i-rotate-a-coordinate-around-a-circle
    const xRot = Math.cos(radians)*(fromXY.X - aroundXY.X) - Math.sin(radians)*(fromXY.Y - aroundXY.Y) + aroundXY.X
    const yRot = Math.sin(radians)*(fromXY.X - aroundXY.X) + Math.cos(radians)*(fromXY.Y - aroundXY.Y) + aroundXY.Y
    

    return {X: xRot, Y: yRot }
}

export function getPosOnCircle(ringLen, ringIdx, firstPos, centerPos) {
    const rotateRadians =  (2*Math.PI / ringLen) * ringIdx
    return rotateAroundCentre(centerPos, firstPos,  rotateRadians)
}

export function bpmToMilli(bpm) {
    return 60000 / bpm
}

export function loopIncrement (currIdx, length) {
    return (currIdx == length) ? 0 : 1+currIdx
  }

export function getActivePulses(rings, idx) {
    // returns all pulses that are not rests on idx position of every ring list in rings
    var activePulses = []
    for (let i=0; i<rings.length; i++) {
        const ring = rings[i]
        const pulse = ring.getPulse(idx)
        if (pulse != ring.restValue) {
            activePulses.push(pulse)
        }
    }
    return activePulses
}

export async function playPulses(pulses, sounds) {  
    const findSoundInCache = (soundFile) => {
        var cacheSounds = sounds

        // look for not playing refObjs with this sound in cache
        cacheSounds = cacheSounds.filter(obj => obj.file == soundFile )
        cacheSounds = cacheSounds.filter(obj => !obj.isPlaying)

        if (cacheSounds.length > 0) {
            // found some avaliable sounds
            const sound = cacheSounds[0]    
            return sound
        }

    }

    const markCacheSoundIsPlaying = (id, isPlaying) => {
        var cacheSounds = sounds
        // mutates ref obj prop in cache list
        // find by id and update
        for (let i=0; i<sounds.length; i++) {
            if (cacheSounds[i].id == id) {
                // found it, set property
                cacheSounds[i].isPlaying = isPlaying
            }
        }
    }

    // load and play their sounds
    for (let i=0; i<pulses.length; i++) {
        const pulse = pulses[i] 
        // grab loaded sound by pulse name
        const { sound, id, file, isPlaying } = findSoundInCache(pulse.sound)

        markCacheSoundIsPlaying(sound.id, true)

        // reset position of sound to 0 (MUST BE DONE OR DOESNT PLAY!)
        sound.setPositionAsync(0)
        // play sound
        .then(() => sound.playAsync())
        // mark sound as finished playing in cache ref obj
        .then(() => markCacheSoundIsPlaying(sound.id, false))
    }
}

export function rangeWithDisclude(start, end, excludeNums) {
    const preNums = [...Array(start).keys()]
    excludeNums = preNums.concat(excludeNums)
    // filter out excludeNums
    return [...Array(end).keys()].filter(n => excludeNums.indexOf(n) == -1)
}

export function getRandomID() {
    return Math.floor(Math.random() * 1000000)
}

export function transposeAudio(semitones) {
    // will return the playback speed (factor) you play your audio clip at to shift its pitch semitones higher
    const speed = 2**(semitones/12)
    return speed 
}

export function getCommonRingProperty(ring, pulsePropFn) {
    var common = null
    for (let i=0; i<ring.length; i++) {
        const pulse = ring.beats[i]
        if (pulse != ring.restValue) {
            const prop = pulsePropFn(pulse)
            if (i == 0) {
                // first obj
                common = prop
            } else {
                // compare with common
                if (common != prop) {
                    return null // NO COMMON
                }
            }
        }
    }
    return common
}