import { getDeviceNormFactor } from "../Helpers"

export const TAB_ICON_SIZE = 24 * getDeviceNormFactor()
export const GOLDEN_RATIO = 1.618 

// visualizer sizing properties. 
// they are visual properties so they use NormFactor
export const RING_INNERMOST_DIST = 39 * getDeviceNormFactor()
export const RING_SHIFT_DIST = 27 * getDeviceNormFactor()
export const RING_WIDTH = 8 * getDeviceNormFactor()
export const PULSE_RADIUS = 15 * getDeviceNormFactor()
export const CLOCKHAND_WIDTH = 10 * getDeviceNormFactor()

export const LONGPRESS_LENGTH = 800

export const MAX_NUM_RINGS = 5