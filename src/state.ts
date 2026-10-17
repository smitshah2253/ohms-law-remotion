import { interpolate } from "remotion";
import { easings } from "./motion";

export type HighlightTarget = "none" | "voltage" | "resistance";

export interface CircuitState {
  voltage: number;
  resistance: number;
  current: number;
  flowSpeed: number;
  highlight: HighlightTarget;
}

/**
 * Pure deterministic state calculator for any frame in the 1170-frame explainer.
 * 
 * Keyframe Timeline:
 * - Baseline: voltage 12 V, resistance 4 Ω -> current 3 A.
 * - Frames 345-360: highlight = 'voltage'.
 * - Frames 360-405 (45f): voltage 12 -> 24 V (easings.change).
 * - Frames 405-495: hold voltage at 24 V.
 * - Frames 495-525 (30f): voltage 24 -> 12 V (easings.change). Highlight off at 525.
 * - Frames 555-570: highlight = 'resistance'.
 * - Frames 570-615 (45f): resistance 4 -> 8 Ω (easings.change).
 * - Frames 615-705: hold resistance at 8 Ω.
 * - Frames 705-735 (30f): resistance 8 -> 4 Ω (easings.change). Highlight off at 735.
 * - Frames 735-825: neutral baseline hold (12 V, 4 Ω, 3 A).
 * - Frames 825-837: highlight = 'voltage'.
 * - Frames 837-882 (45f): voltage 12 -> 24 V (easings.change).
 * - Frames 882-915: hold voltage at 24 V.
 * - Frames 915-945 (30f): voltage 24 -> 12 V (easings.change).
 * - Frames 945-957: highlight = 'resistance'.
 * - Frames 957-1002 (45f): resistance 4 -> 8 Ω (easings.change).
 * - Frames 1002-1035: hold resistance at 8 Ω.
 * - Frames 1035-1065 (30f): resistance 8 -> 4 Ω (easings.change).
 * - Frames 1065-1170: neutral baseline hold (12 V, 4 Ω, 3 A). Highlight = 'none'.
 * - current: voltage / resistance (always computed).
 * - flowSpeed: 4 * current (pixels per frame).
 */
export const getState = (frame: number): CircuitState => {
  // 1. Compute Voltage (Baseline 12 V)
  let voltage = 12;
  if (frame < 360) {
    voltage = 12;
  } else if (frame >= 360 && frame <= 405) {
    voltage = interpolate(frame, [360, 405], [12, 24], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 405 && frame < 495) {
    voltage = 24;
  } else if (frame >= 495 && frame <= 525) {
    voltage = interpolate(frame, [495, 525], [24, 12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 525 && frame < 837) {
    voltage = 12;
  } else if (frame >= 837 && frame <= 882) {
    voltage = interpolate(frame, [837, 882], [12, 24], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 882 && frame < 915) {
    voltage = 24;
  } else if (frame >= 915 && frame <= 945) {
    voltage = interpolate(frame, [915, 945], [24, 12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else {
    voltage = 12;
  }

  // 2. Compute Resistance (Baseline 4 Ω)
  let resistance = 4;
  if (frame < 570) {
    resistance = 4;
  } else if (frame >= 570 && frame <= 615) {
    resistance = interpolate(frame, [570, 615], [4, 8], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 615 && frame < 705) {
    resistance = 8;
  } else if (frame >= 705 && frame <= 735) {
    resistance = interpolate(frame, [705, 735], [8, 4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 735 && frame < 957) {
    resistance = 4;
  } else if (frame >= 957 && frame <= 1002) {
    resistance = interpolate(frame, [957, 1002], [4, 8], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else if (frame > 1002 && frame < 1035) {
    resistance = 8;
  } else if (frame >= 1035 && frame <= 1065) {
    resistance = interpolate(frame, [1035, 1065], [8, 4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
  } else {
    resistance = 4;
  }

  // 3. Highlight state
  let highlight: HighlightTarget = "none";
  if (frame >= 345 && frame <= 525) {
    highlight = "voltage";
  } else if (frame >= 555 && frame < 735) {
    highlight = "resistance";
  } else if (frame >= 825 && frame <= 837) {
    highlight = "voltage";
  } else if (frame >= 945 && frame <= 957) {
    highlight = "resistance";
  }

  // 4. Current = Voltage / Resistance (always computed, never keyed)
  const current = voltage / resistance;

  // 5. Flow Speed in pixels per frame = 4 * current
  const flowSpeed = 4 * current;

  return {
    voltage,
    resistance,
    current,
    flowSpeed,
    highlight,
  };
};
