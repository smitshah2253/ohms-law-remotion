/**
 * Design tokens for Ohm's Law Explainer.
 * 
 * Exact requested tokens:
 * - colors: ink, green, amber, grays, background
 * - fontSizes: hero 96, headline 64, label 36, small 28
 * - spacing unit 8
 * - stroke width 6
 * - radius 12
 */

export const theme = {
  // Colors (Strict token rules)
  colors: {
    background: "#FFFFFF",
    ink: "#1F2933",
    /** Primary accent: Used ONLY for current/flow and key emphasis */
    green: "#00A86B",
    /** Accent: Used ONLY to highlight the value that is changing */
    amber: "#F2A93B",
    grayBorder: "#E4E7EB",
    grayMuted: "#9AA5B1",
  },

  // Font Sizes as requested
  fontSizes: {
    hero: 96,
    headline: 64,
    label: 36,
    small: 28,
  },

  // Spacing unit
  spacingUnit: 8,

  // Stroke width
  strokeWidth: 6,

  // Radius
  radius: 12,

  // Composition metadata
  composition: {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 1170,
  },

  // Layout Grid (12-column, 120px outer margins)
  layout: {
    width: 1920,
    height: 1080,
    outerMarginX: 120,
    outerMarginY: 100,
    spacingUnit: 8,
    columns: 12,
    gutter: 24, // 3 * 8px
    contentWidth: 1680, // 1920 - 240
  },

  // Stroke and Geometry Aliases
  geometry: {
    wireStrokeWidth: 6,
    boxStrokeWidth: 4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    boxCornerRadius: 12,
  },

  // Typography definitions (Manrope 800/600/500 with tabular figures)
  typography: {
    fontFamily: "'Manrope', sans-serif",
    weights: {
      headline: 800 as const,
      label: 600 as const,
      body: 500 as const,
    },
    hero: {
      fontWeight: 800 as const,
      fontSize: 96,
      lineHeight: 1.1,
      fontVariantNumeric: "tabular-nums" as const,
    },
    headline: {
      fontWeight: 800 as const,
      fontSize: 64,
      lineHeight: 1.15,
      fontVariantNumeric: "tabular-nums" as const,
    },
    label: {
      fontWeight: 600 as const,
      fontSize: 36,
      lineHeight: 1.25,
      fontVariantNumeric: "tabular-nums" as const,
    },
    labelSmall: {
      fontWeight: 600 as const,
      fontSize: 20,
      lineHeight: 1.3,
      letterSpacing: "0.04em",
      fontVariantNumeric: "tabular-nums" as const,
    },
    small: {
      fontWeight: 500 as const,
      fontSize: 28,
      lineHeight: 1.35,
      fontVariantNumeric: "tabular-nums" as const,
    },
    body: {
      fontWeight: 500 as const,
      fontSize: 24,
      lineHeight: 1.5,
      fontVariantNumeric: "tabular-nums" as const,
    },
    bodySmall: {
      fontWeight: 500 as const,
      fontSize: 18,
      lineHeight: 1.4,
      fontVariantNumeric: "tabular-nums" as const,
    },
    formula: {
      fontWeight: 800 as const,
      fontSize: 84,
      lineHeight: 1.1,
      fontVariantNumeric: "tabular-nums" as const,
    },
    metricValue: {
      fontWeight: 800 as const,
      fontSize: 56,
      lineHeight: 1.1,
      fontVariantNumeric: "tabular-nums" as const,
    },
  },
} as const;

export type Theme = typeof theme;
