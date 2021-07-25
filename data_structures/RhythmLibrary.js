// Create some popular rhythms

// BIG THANKS TOO THE VIDEO BELOW!! SOURCE OF THE RHYTHMS 
// https://www.youtube.com/watch?v=tm2BgO1VaRY

import { DefaultPallete } from "../ui/Colors"
import { DrumSounds } from "./Sounds"
import { createRestBeats, Pulse, Rhythm, Ring } from "./Structs"

// 4/4 with onbeat on 1 and offbeat on 3
var four_beat_ring = new Ring(4, createRestBeats(4), DEFAULT_RING_COLOR)
four_beat_ring.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_ONBEAT_SOUND, DEFAULT_PULSE_ONBEAT_COLOR))
four_beat_ring.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_OFFBEAT_SOUND, DEFAULT_PULSE_OFFBEAT_COLOR))
export const FourFourSample = new Rhythm([four_beat_ring] , 4)

// 4/4 with two rings with one onbeat and offbeat each
var ring_a = new Ring(4, createRestBeats(4), DefaultPallete.ring)
ring_a.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_ONBEAT_SOUND, DEFAULT_PULSE_ONBEAT_COLOR))
ring_a.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_OFFBEAT_SOUND, DEFAULT_PULSE_OFFBEAT_COLOR))

var ring_b = new Ring(4, createRestBeats(4), DefaultPallete.ring_alt)
ring_b.addPulse(1, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_ONBEAT_SOUND, DEFAULT_PULSE_ONBEAT_COLOR))
ring_b.addPulse(3, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_OFFBEAT_SOUND, DEFAULT_PULSE_OFFBEAT_COLOR))
export const TwoRingSample = new Rhythm([ring_a, ring_b] , 4)


// Four on the floor
var kickRing = new Ring(4, createRestBeats(4), DefaultPallete.ring)
kickRing.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.kick, DefaultPallete.jerryGarcia))
kickRing.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.kick, DefaultPallete.jerryGarcia))

var snareRing = new Ring(4, createRestBeats(4), DefaultPallete.ring_alt)
snareRing.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.snare, DefaultPallete.bobWeir))

var closedHatRing = new Ring(4, createRestBeats(4), DefaultPallete.ring)
closedHatRing.addPulse(1, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.philLesh))
closedHatRing.addPulse(3, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.closedHat, DefaultPallete.philLesh))

var openHatRing = new Ring(4, createRestBeats(4), DefaultPallete.ring_alt)
openHatRing.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.openHat, DefaultPallete.mickeyHart))

var clap = new Ring(4, createRestBeats(4), DefaultPallete.ring)
clap.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DrumSounds.clap, DefaultPallete.billKruetzmann))


// DEFAULT PROPERTIES FOR THE RHYTHMS
export const DEFAULT_RING_LENGTH = 4
export const DEFAULT_PULSE_VOLUME = 100
export const DEFAULT_PULSE_ONBEAT_SOUND = "../sounds/drums/kick.wav"
export const DEFAULT_PULSE_OFFBEAT_SOUND = "../sounds/drums/snare.wav"
export const DEFAULT_PULSE_ONBEAT_COLOR = DefaultPallete.pulseOnbeat
export const DEFAULT_PULSE_OFFBEAT_COLOR = DefaultPallete.pulseOffbeat
export const DEFAULT_RING_COLOR = DefaultPallete.ring
export const DEFAULT_RHYTHM = TwoRingSample
