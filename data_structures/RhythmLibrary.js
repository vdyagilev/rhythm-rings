// Create some popular rhythms

// BIG THANKS TOO THE VIDEO BELOW!! SOURCE OF THE RHYTHMS 
// https://www.youtube.com/watch?v=tm2BgO1VaRY

import { DefaultPallete } from "../ui/Colors"
import { DrumSounds } from "./Sounds"
import { createRestBeats, Pulse, Rhythm, Ring } from "./Structs"


// BREAKBEATS

// 8 STEPS (2 STEPS = 1 BEAT = (1e&a))
var kickRing = new Ring(8, createRestBeats(8), DefaultPallete.ring)
kickRing.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.kick, DefaultPallete.billKruetzmann))
kickRing.addPulse(4, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.kick, DefaultPallete.billKruetzmann))

var snareRing = new Ring(8, createRestBeats(8), DefaultPallete.ring_alt)
snareRing.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.snare, DefaultPallete.pigpen))
snareRing.addPulse(6, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.snare, DefaultPallete.pigpen))

var closedHatRing = new Ring(8, createRestBeats(8), DefaultPallete.ring)
closedHatRing.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(1, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(3, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(4, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(5, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(6, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))
closedHatRing.addPulse(7, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.robertHunter))


export const RHYTHM_BILLIE_JEAN = new Rhythm([kickRing, snareRing, closedHatRing], 8, "Billie Jean")


// DEFAULT PROPERTIES FOR THE RHYTHMS
export const DEFAULT_RING_LENGTH = 4
export const DEFAULT_PULSE_VOLUME = 100
export const DEFAULT_PULSE_ONBEAT_SOUND = "../sounds/drums/kick.wav"
export const DEFAULT_PULSE_OFFBEAT_SOUND = "../sounds/drums/snare.wav"
export const DEFAULT_PULSE_ONBEAT_COLOR = DefaultPallete.pulseOnbeat
export const DEFAULT_PULSE_OFFBEAT_COLOR = DefaultPallete.pulseOffbeat
export const DEFAULT_RING_COLOR = DefaultPallete.ring
export const DEFAULT_RHYTHM = RHYTHM_BILLIE_JEAN
