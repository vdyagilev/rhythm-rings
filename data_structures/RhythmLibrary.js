import { DEFAULT_PULSE_OFFBEAT_SOUND, DEFAULT_PULSE_ONBEAT_SOUND, DEFAULT_PULSE_VOLUME, Pulse, Rhythm, Ring } from "./Structs"

// Create some popular rhythms

var four_beat_ring = new Ring(4)
four_beat_ring.addPulse(0, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_ONBEAT_SOUND))
four_beat_ring.addPulse(2, new Pulse(DEFAULT_PULSE_VOLUME, DEFAULT_PULSE_OFFBEAT_SOUND))

export const FourFourSample = new Rhythm([four_beat_ring] , 4)