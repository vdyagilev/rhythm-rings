export const DEFAULT_RING_LENGTH = 4
export const DEFAULT_PULSE_VOLUME = 100
export const DEFAULT_PULSE_ONBEAT_SOUND = "../sounds/drums/kick.wav"
export const DEFAULT_PULSE_OFFBEAT_SOUND = "../sounds/drums/snare.wav"

export class Pulse {
    constructor(volume, sound) {
        this.volume = volume
        this.sound = sound
    }
}

export class Ring {
    constructor(length) {
        this.restValue = null // what represents an empty beat (rest)
        this.length = length
        this.beats = new Array(length).fill(this.restValue)
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
