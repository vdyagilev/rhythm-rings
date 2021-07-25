import { DEFAULT_PULSE_OFFBEAT_COLOR, DEFAULT_PULSE_ONBEAT_COLOR, DEFAULT_PULSE_ONBEAT_SOUND, DEFAULT_PULSE_VOLUME, DEFAULT_RING_COLOR, DEFAULT_RING_COLOR_ALT } from "./RhythmLibrary"

export class Pulse {
    constructor(volume, sound, color) {
        this.volume = volume
        this.sound = sound
        this.color = color
    }

}

export const REST_VALUE = null

export function createRestBeats(length) {
    // Use to initialize empty ring
    return new Array(length).fill(REST_VALUE)
}

export class Ring {
    constructor(length, beats, color) {
        this.restValue = null // what represents an empty beat (rest)
        this.length = length
        this.beats = beats // every beat is either a rest or a pulse
        this.color = color
    }
    addPulse(index, pulse) {
        this.beats[index] = pulse
    }

    addRest(index) {
        this.beats[index] = this.restValue
    }
}

export class Rhythm {
    constructor(rings, length) {
        this.rings = rings
        this.length = length
    }
}
