import { Dimensions, PixelRatio } from 'react-native';
import { REST_VALUE } from './data_structures/Structs';
import { Video } from 'expo-av';

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
        if (pulse != REST_VALUE) {
            activePulses.push(pulse)
        }
    }
    return activePulses
}

export async function playPulses(pulses, sounds) {

    const findSoundInCache = (soundFile) => {
        var cacheSounds = sounds.slice()
        cacheSounds = cacheSounds.filter(obj => obj.file == soundFile)
        if (cacheSounds.length > 0) {
            return cacheSounds[0].sound
        }
    }

    // load and play their sounds
    for (let i=0; i<pulses.length; i++) {
        const pulse = pulses[i] 
        // grab loaded sound by pulse name
        const sound = findSoundInCache(pulse.sound)

        // reset position of sound to 0 (MUST BE DONE OR DOESNT PLAY!)
        // play sound
        sound.setPositionAsync(0).then(() => sound.playAsync())
    }
}

export function rangeWithDisclude(start, end, excludeNums) {
    const preNums = [...Array(start).keys()]
    excludeNums = preNums.concat(excludeNums)
    // filter out excludeNums
    return [...Array(end).keys()].filter(n => excludeNums.indexOf(n) == -1)
}