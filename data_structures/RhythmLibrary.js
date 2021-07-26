// Create some popular rhythms

// BIG THANKS TOO THE VIDEO BELOW!! SOURCE OF THE RHYTHMS 
// https://www.youtube.com/watch?v=tm2BgO1VaRY

import { rangeWithDisclude } from "../Helpers"
import { DefaultPallete } from "../ui/Colors"
import { DrumSounds } from "./Sounds"
import { createRestBeats, Pulse, Rhythm, Ring } from "./Structs"

// DEFAULT PROPERTIES FOR THE RHYTHMS
export const DEFAULT_RING_LENGTH = 4
export const DEFAULT_PULSE_VOLUME = 1
export const DEFAULT_PULSE_ONBEAT_SOUND = DrumSounds.kick
export const DEFAULT_PULSE_OFFBEAT_SOUND = DrumSounds.snare
export const DEFAULT_PULSE_ONBEAT_COLOR = DefaultPallete.pulseOnbeat
export const DEFAULT_PULSE_OFFBEAT_COLOR = DefaultPallete.pulseOffbeat
export const DEFAULT_RING_COLOR = DefaultPallete.ring

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

const DebuggerRhythm = {
    name: "Debugger Rhythm",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 1],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.billKruetzmann,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.snare,
            pulses: [2, 3],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.pigpen,
            pulseVolume: DEFAULT_PULSE_VOLUME/2
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [1, 3],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.robertHunter,
            pulseVolume: DEFAULT_PULSE_VOLUME/4
        }
    ],
    length: 4,
}

// BREAKBEATS

// 8 STEPS (2 STEPS = 1 BEAT = (1e&a))

const BillieJean = {
    name: "Billie Jean",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 4],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.billKruetzmann,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.snare,
            pulses: [2, 6],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.pigpen,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 1, 2, 3, 4, 5, 6, 7],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.robertHunter,
            pulseVolume: DEFAULT_PULSE_VOLUME
        }
    ],
    length: 8,
}

// 16 STEPS 

const TheFunkyDrummer = {
    name: "The Funky Drummer",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 2, 6, 10, 13],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.billKruetzmann,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 7, 9, 11, 12, 15],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.pigpen,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.closedHat,
            pulses: rangeWithDisclude(0, 16, [11, 7]), // all but 11 and 7
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.robertHunter,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.openHat,
            pulses: [11, 7],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.mickeyHart,
            pulseVolume: DEFAULT_PULSE_VOLUME
        }
    ],
    length: 16
}

const ImpeachThePresident = {
    name: "Impeach the President",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 7, 8, 14],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.billKruetzmann,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 12],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.pigpen,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 2, 4, 6, 7, 8, 12, 14],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.robertHunter,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.openHat,
            pulses: [10,],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.mickeyHart,
            pulseVolume: DEFAULT_PULSE_VOLUME
        }
    ],
    length: 16
}

const WhenTheLeeveeBreaks = {
    name: "When the Leevee Breaks",
    rings: [
        {
            sound: DrumSounds.kick,
            pulses: [0, 1, 7, 10, 11],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.billKruetzmann,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.snare,
            pulses: [4, 12],
            ringColor: DefaultPallete.ring_alt,
            pulseColor: DefaultPallete.pigpen,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
        {
            sound: DrumSounds.closedHat,
            pulses: [0, 2, 4, 6, 8, 10, 12, 14],
            ringColor: DefaultPallete.ring,
            pulseColor: DefaultPallete.robertHunter,
            pulseVolume: DEFAULT_PULSE_VOLUME
        },
    ],
    length: 16
}

// ******* CREATE STRUCTS FROM JSON FILES *************
const RhythmsJson = [BillieJean, TheFunkyDrummer, ImpeachThePresident, WhenTheLeeveeBreaks]

// from-json builder function
export function buildRhythmFromJson(json) {
    var rings = []
    const length = json.length
    for (let i=0; i<json.rings.length;i++){
        const ringJson = json.rings[i]
        // create struct objs from the json 
        const ring = new Ring(length, createRestBeats(length), ringJson.ringColor)
        const pulse = new Pulse(ringJson.pulseVolume, ringJson.sound, ringJson.pulseColor)
        ring.addPulses(ringJson.pulses, pulse)

        rings.push(ring)
    }   
    var rhythm = new Rhythm(rings, length, json.name)
    return rhythm
}

export const RHYTHM_LIBRARY = RhythmsJson.map(json => buildRhythmFromJson(json))

// HERE ARE CATEGORIES THAT EACH RHYTM BELONGS IN (CATEGORIES BY POSITION INDEX)
export const RHYTHM_LIBRARY_CATEGORIES = [
    {name: "Breakbeat", startIdx: 0, endIdx: 10}
]

export const DEFAULT_RHYTHM =  buildRhythmFromJson(DebuggerRhythm) //RHYTHM_LIBRARY[0]

// Each rhythm is categoriezed by its position in the RHYTHM_LIBRARY list
export function getRhythmCategory(rhythm){
    const libraryPos = RHYTHM_LIBRARY.indexOf(rhythm)
    const categories = RHYTHM_LIBRARY_CATEGORIES
    if (libraryPos == -1) {
        console.log('ERROR: UNCATEGORIZED RHYTHM ***************************** \n\n\n\n\n ')
    }

    for (let i=0; i<categories.length;i++) {
        const cat = categories[i]
        if (libraryPos < cat.endIdx && libraryPos > cat.startIdx) {
            // located category
            return cat.name
        }
    }
}