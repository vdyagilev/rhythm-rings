import { getRandomID } from "../Helpers"

import { DEFAULT_PULSE_COLOR, DEFAULT_PULSE_SOUND, DEFAULT_PULSE_VOLUME, DEFAULT_RING_COLOR } from './Constants'

export class Pulse {
    constructor(volume, sound, color) {
        this.volume = volume
        this.sound = sound
        this.color = color
        this._id = getRandomID()
    }
}

export function ArePulsesEqual(uno, dos, restValue) {
    if (uno == restValue && dos == restValue) {
        return true
    }
    if (uno == restValue || dos == restValue) {
        return false 
    }

    else {
        return (uno.volume == dos.volume) 
        && (uno.sound == dos.sound)
        && (uno.color == dos.color)
    }
}

export function createNewPulse() {
    return new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_SOUND, DEFAULT_PULSE_COLOR)
}

export function createRestBeats(length, restValue) {
    // Use to initialize empty ring
    return new Array(length).fill(restValue)
}

export class Ring {
    constructor(length, beats, color) {
        this.length = length
        this.beats = beats // every beat is either a rest or a pulse
        this.color = color
        this._id = getRandomID()
        this.restValue = null // what represents an empty beat (rest)
    }
    
    getPulse(index) {
        return this.beats[index]
    }

    addPulse(index, pulse) {
        // Add pulse onto index
        this.beats[index] = pulse
    }
    
    addRest(index) {
        this.beats[index] = this.restValue
    }

    
}

export function createNewRing(length) {
    return new Ring(length, createRestBeats(length, null), DEFAULT_RING_COLOR)
}

export class Rhythm {
    constructor(rings, length, name, category) {
        this.rings = rings
        this.length = length
        this.name = name
        this.category = category
        this.restValue = null
        this._id = getRandomID()
    }
}

