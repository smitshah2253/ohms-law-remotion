export type HighlightTarget = "voltage" | "resistance" | "current" | null;

export interface CircuitState {
  voltage: number;       // In Volts (e.g. 12 or 24)
  resistance: number;    // In Ohms (e.g. 10 or 30)
  current: number;       // In Amperes (calculated or animated)
  activeHighlight: HighlightTarget;
  flowActive: boolean;
  flowSpeedMultiplier?: number;
}
