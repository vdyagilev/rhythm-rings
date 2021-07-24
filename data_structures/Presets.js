import { FourFourSample } from "./RhythmLibrary";

export class GamePreset {
    constructor(name, rhythm) {
      this.name = name;
      this.rhythm = rhythm;
    }
}

export const GAME_PRESETS = [FourFourSample]


export const DEFAULT_GAME_PRESET = FourFourSample