import React from "react";
import { theme } from "../../theme";
import { resistorPath, resistorLength } from "./circuitPath";

export interface ResistorProps {
  progress?: number; // 0 to 1 for self-drawing
  opacity?: number;
  highlighted?: boolean;
  strokeWidth?: number;
}

/**
 * Classic Zigzag Resistor with 6 peaks.
 * 6px wire stroke (or dynamic stroke-width), round caps/joins, ink color (#1F2933).
 * Supports self-drawing progress (0 to 1) via strokeDashoffset.
 */
export const Resistor: React.FC<ResistorProps> = ({
  progress = 1,
  opacity = 1,
  highlighted = false,
  strokeWidth = theme.strokeWidth,
}) => {
  const strokeColor = highlighted ? theme.colors.amber : theme.colors.ink;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const dashOffset = resistorLength * (1 - clampedProgress);

  return (
    <g opacity={opacity}>
      <path
        d={resistorPath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
        strokeLinejoin={theme.geometry.strokeLinejoin}
        strokeDasharray={`${resistorLength} ${resistorLength}`}
        strokeDashoffset={dashOffset}
      />
    </g>
  );
};
