import React from "react";
import { getLength } from "@remotion/paths";
import { theme } from "../../theme";

export interface WireProps {
  path: string;
  progress?: number; // 0 to 1
  length?: number;   // Optional precomputed length
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}

/**
 * Self-drawing SVG Wire component.
 * Uses strokeDasharray and strokeDashoffset driven by @remotion/paths
 * to animate stroke progression from 0 to 1.
 */
export const Wire: React.FC<WireProps> = ({
  path,
  progress = 1,
  length,
  color = theme.colors.ink,
  strokeWidth = theme.strokeWidth,
  opacity = 1,
}) => {
  const pathLength = length ?? getLength(path);
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const dashOffset = pathLength * (1 - clampedProgress);

  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={theme.geometry.strokeLinecap}
      strokeLinejoin={theme.geometry.strokeLinejoin}
      strokeDasharray={`${pathLength} ${pathLength}`}
      strokeDashoffset={dashOffset}
      opacity={opacity}
    />
  );
};
