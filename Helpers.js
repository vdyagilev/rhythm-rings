import { Dimensions } from 'react-native';

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
        
        } else {
            return null
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
        const cacheSound = findSoundInCache(pulse.sound)

        if (cacheSound != null) {
            const { sound, id, file, isPlaying } = cacheSound

            markCacheSoundIsPlaying(sound.id, true)

            // reset position of sound to 0 (MUST BE DONE OR DOESNT PLAY!)
            sound.setPositionAsync(0)
            // play sound
            .then(() => sound.playAsync())
            // mark sound as finished playing in cache ref obj
            .then(() => markCacheSoundIsPlaying(sound.id, false))
        
        } else {
            console.error("Cache Error: Sound (id #" + pulse.sound + ") Not Found")
        }
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

export function getCommonRingProperty(ring, getPropFunc) {
    var common = null

    for (let i=0; i<ring.length; i++) {
        const pulse = ring.beats[i]

        if (pulse != ring.restValue) {
            const prop = getPropFunc(pulse)

            if (!common) {
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

export function angleFromCircleCentreAndEdge(centerPos, edgePos, inDegrees) {
    // return angle between centerPos and edgePos in radians
    // https://stackoverflow.com/questions/22888773/how-to-get-angle-of-point-from-center-point
    var angle = Math.atan2(centerPos.Y-edgePos.Y, centerPos.X-edgePos.X)

    // Add extra functions into Math package
    // Convert from degrees to radians.
    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    }
    // Convert from radians to degrees.
    Math.degrees = function(radians) {
        return radians * 180 / Math.PI;
    }

    if (inDegrees) {
        angle = Math.degrees(angle) % 360
    }
    return angle
}

export function calculateBeatIdxFromRingTouch(locationX, locationY, topPos, centerPos, numBeats) {
    // Given that topPos is the top of Ring with numBeats, 
    // and centerPos the center, calculate which beatIdx the touch was in
    // Pos: {X: num, Y: num}, returns: {inSlice: false, inCircle: false, beatIdx: -1}

    for (let b=0; b<numBeats; b++) {

        // Calculate left and right slice coordinates of the circle pizza slice
        var startIdx, endIdx
        if (b == numBeats-1) {
            // last circle slice has a wrap-around 
            startIdx = b
            endIdx = 0
           
        } else {
            startIdx = b
            endIdx = b+1
        }

        var edgePosStart = getPosOnCircle(numBeats, startIdx, topPos, centerPos)
        var edgePosEnd = getPosOnCircle(numBeats, endIdx, topPos, centerPos)

        
        // convert boundaries from points to angles
        const startAngle = angleFromCircleCentreAndEdge(centerPos, edgePosStart, false)
        const endAngle = angleFromCircleCentreAndEdge(centerPos, edgePosEnd, false)
        
        
        // calculate if point is inside this pie slice
        const ringRadius = Math.abs(topPos.Y - centerPos.Y)
        const { inCircle, inSlice } = pointInPieSlice(centerPos, ringRadius, {X: locationX, Y: locationY}, startAngle, endAngle)

        console.log("beat #", b, " inCircle: ", inCircle, " inSlice: ", inSlice)

        // return if inSlice
        if (inSlice) {
            console.error("inslice found: beat #" , b,)
            return {inSlice: true, inCircle: true, beatIdx: b}
        }

        // console.log("\ntouch (x,y)", locationX, locationY)
        // console.log("Beat Num:", b)
        // console.log("(edgePosStart, edgePosEnd)", edgePosStart, edgePosEnd)
        // console.log("(startAngle, endAngle)", startAngle, endAngle)
        // console.log("(ringRadius, inCircle, inSlice)", ringRadius, inCircle, inSlice)
        // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    
    }
    return {inSlice: false, inCircle: false, beatIdx: -1}
}

export function pointInPieSlice(centerPos, radius, pointPos, startAngle, endAngle) {
    // Returns {inCircle: bool, inSlice: bool}

    // https://stackoverflow.com/questions/6270785/how-to-determine-whether-a-point-x-y-is-contained-within-an-arc-section-of-a-c
    const R = Math.sqrt(Math.pow((pointPos.X - centerPos.X), 2) + Math.pow((pointPos.Y - centerPos.Y), 2))
    const A = Math.atan2(pointPos.Y - centerPos.Y, pointPos.X - centerPos.X)
    
    if (R > radius) {
        // outside the circle entirely 
        return {inCircle: false, inSlice: false} 
    } 

    if (startAngle < endAngle) {
        if (startAngle < A && A < endAngle) {
            // inside
            return {inCircle: true, inSlice: true}
        }
    } else {
        if (A > startAngle) {
            // inside
            return {inCircle: true, inSlice: true}
        } else if (A < endAngle) {
            // inside
            return {inCircle: true, inSlice: true}
        }
    }
    // else outside
    return {inCircle: true, inSlice: false}
}