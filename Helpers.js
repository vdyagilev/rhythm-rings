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
    const rotateRadians = (2*Math.PI / ringLen) * ringIdx
    return rotateAroundCentre(centerPos, firstPos, rotateRadians)
}

export function bpmToMilli(bpm) {
    return 60000 / bpm
}

export function loopIncrement (currIdx, length) {
    return (currIdx == length) ? 0 : 1+currIdx
  }