// Create some popular rhythms

// BIG THANKS TOO THE VIDEO BELOW!! SOURCE OF THE RHYTHMS 
// https://www.youtube.com/watch?v=tm2BgO1VaRY

import { rangeWithDisclude } from "../Helpers"
import { DEFAULT_PULSE_COLOR, DEFAULT_PULSE_COLOR_ALT, DEFAULT_PULSE_VOLUME, DEFAULT_RING_COLOR, DEFAULT_RING_COLOR_ALT } from "./Constants"
import { DrumSounds } from "./Sounds"
import { createRestBeats, Pulse, Rhythm, Ring } from "./Structs"


// from-json builder function
export function buildRhythmFromJson(json) {
    var rings = []
    const numRings = json.rings.length
    const numBeats = json.length
    for (let i=0; i<numRings; i++){
        const ringJson = json.rings[i]

        // create struct objs from the json 
        var ring = new Ring(numBeats, createRestBeats(numBeats, null), ringJson.ringColor)
       

        for (let j=0; j<ringJson.pulses.length; j++) {
            const beatIdx = ringJson.pulses[j]
            const pulse = new Pulse(ringJson.pulseVolume, ringJson.sound, ringJson.pulseColor)

            ring.addPulse(beatIdx, pulse)
        }

        rings.push(ring)
    }   

    var rhythm = new Rhythm(rings, numBeats, json.name, json.category)
    return rhythm
}

// *********** RHYTHM TEMPLATE ****************

// const RHYTHM = {
//     rings: [
//         {
//             sound: ,
//             pulses: [],
//             ringColor: ,
//             pulseColor: ,
//             pulseVolume: ,
//         },
//     ],
//     length: 1
// }

// *********** RHYTHM TEMPLATE ****************

const DefaultRingVisuals = {
    ringColor: DEFAULT_RING_COLOR,
    pulseColor: DEFAULT_PULSE_COLOR,
    pulseVolume: DEFAULT_PULSE_VOLUME
}

const DefaultRingVisualsAlt = {
    ringColor: DEFAULT_RING_COLOR_ALT,
    pulseColor: DEFAULT_PULSE_COLOR_ALT,
    pulseVolume: DEFAULT_PULSE_VOLUME
}

export const DebuggerRhythm = {
    name: "Debugger Rhythm",
    category: "Cat 1",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 1],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.snare,
            pulses: [2, 3],
            ...DefaultRingVisualsAlt
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [1, 3],
            ...DefaultRingVisuals
        }
    ],
    length: 4,
}

// BREAKBEATS

// 8 STEPS (2 STEPS = 1 BEAT = (1e&a))

export const BillieJean = {
    name: "Billie Jean",
    category: "Cat 2",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 4],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.snare,
            pulses: [2, 6],
            ...DefaultRingVisualsAlt
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 1, 2, 3, 4, 5, 6, 7],
            ...DefaultRingVisuals
        }
    ],
    length: 8,
}

// 16 STEPS 

export const TheFunkyDrummer = {
    name: "The Funky Drummer",
    category: "Cat 2",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 2, 6, 10, 13],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 7, 9, 11, 12, 15],
            ...DefaultRingVisualsAlt
        },
        {
            sound: DrumSounds.closedHat,
            pulses: rangeWithDisclude(0, 16, [11, 7]), // all but 11 and 7
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.openHat,
            pulses: [11, 7],
            ...DefaultRingVisualsAlt
        }
    ],
    length: 16
}

export const ImpeachThePresident = {
    name: "Impeach the President",
    category: "Cat 2",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 7, 8, 14],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 12],
            ...DefaultRingVisualsAlt
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 2, 4, 6, 7, 8, 12, 14],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.openHat,
            pulses: [10],
            ...DefaultRingVisualsAlt
        }
    ],
    length: 16
}

export const WhenTheLeeveeBreaks = {
    name: "When the Leevee Breaks",
    category: "Cat 3",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 1, 7, 10, 11],
            ...DefaultRingVisuals
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 12],
            ...DefaultRingVisualsAlt
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 2, 4, 6, 8, 10, 12, 14],
            ...DefaultRingVisuals
        },
    ],
    length: 16
}

// ******* CREATE STRUCTS FROM JSON FILES *************
export const DEFAULT_RHYTHMS_IN_JSON = [DebuggerRhythm, BillieJean, TheFunkyDrummer, ImpeachThePresident, WhenTheLeeveeBreaks]
