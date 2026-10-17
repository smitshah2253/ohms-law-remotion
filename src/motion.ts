import { Easing, interpolate } from "remotion";

/**
 * Motion choreographies, easings, durations, and pure helper functions.
 * All animations are deterministic functions of the frame number.
 */

export const easings = {
  enter: Easing.bezier(0.22, 1, 0.36, 1),
  change: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const durations = {
  enter: 20,
  stagger: 5,
  change: 45,
  highlight: 12,
  hold: 30,
} as const;

/**
 * Helper: Pure fade-up transition over durations.enter frames.
 * Returns opacity (0 -> 1) and translateY (16 -> 0).
 */
export const fadeUp = (
  frame: number,
  start: number
): { opacity: number; translateY: number } => {
  const opacity = interpolate(frame, [start, start + durations.enter], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  const translateY = interpolate(frame, [start, start + durations.enter], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  return { opacity, translateY };
};

/**
 * Helper: Pure normalized progress (0 -> 1) over an explicit duration.
 */
export const reveal = (
  frame: number,
  start: number,
  duration: number = durations.enter
): number => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
};
