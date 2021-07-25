
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
    // Add pulse onto index
        this.beats[index] = pulse
    }

    addPulses(indexes, pulse) {
    // Add the same pulse onto indexes
        for (let i=0; i<indexes.length;i++){
            this.addPulse(pulse)
        }

    }

    addRest(index) {
        this.beats[index] = this.restValue
    }
    getPulse(index) {
        return this.beats[index]
    }
}

export class Rhythm {
    constructor(rings, length, name) {
        this.rings = rings
        this.length = length
        this.name = name
    }
}
