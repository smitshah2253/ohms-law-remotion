/**
 * Deterministic scene boundaries for 39-second explainer (1170 frames @ 30 fps).
 */
export const timing = {
  fps: 30,
  totalFrames: 1170,
  scenes: {
    hook: {
      start: 0,
      end: 120,
      duration: 120, // 4.0s
    },
    circuit: {
      start: 120,
      end: 330,
      duration: 210, // 7.0s
    },
    voltage: {
      start: 330,
      end: 540,
      duration: 210, // 7.0s
    },
    resistance: {
      start: 540,
      end: 750,
      duration: 210, // 7.0s
    },
    rule: {
      start: 750,
      end: 1170,
      duration: 420, // 14.0s
      subsections: {
        intro: {
          start: 750,
          end: 825,
          duration: 75, // 2.5s
        },
        voltageEffect: {
          start: 825,
          end: 945,
          duration: 120, // 4.0s
        },
        resistanceEffect: {
          start: 945,
          end: 1065,
          duration: 120, // 4.0s
        },
        summary: {
          start: 1065,
          end: 1170,
          duration: 105, // 3.5s
        },
      },
    },
  },
} as const;

export type Timing = typeof timing;
