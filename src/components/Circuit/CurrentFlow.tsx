import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { getPointAtLength } from "@remotion/paths";
import { theme } from "../../theme";
import { timing } from "../../timing";
import { getState } from "../../state";
import {
  conventionalLoopPath,
  conventionalLoopLength,
} from "./circuitPath";

export interface CurrentFlowProps {
  flowStartFrame?: number; // Default 120 (start of Circuit scene)
  dotSpacing?: number;     // Constant 60px
  dotRadius?: number;      // 10px
}

/**
 * Deterministic current flow component.
 * 
 * Rules:
 * - Position is the mathematical INTEGRAL of flowSpeed over time (sum of flowSpeed from frame 0).
 * - Precomputed cumulative phase array via useMemo for maximum render speed across 1170 frames.
 * - Dot spacing constant at 60px along the loop path.
 * - Dot radius: 10px, green (#00A86B), no glow, no shadow.
 * - Fades in over 8 frames from flowStartFrame to prevent visual popping.
 * - Direction: Conventional current (from battery positive around the loop).
 * - Small directional arrowhead near top-right wire.
 */
export const CurrentFlow: React.FC<CurrentFlowProps> = ({
  flowStartFrame = 120,
  dotSpacing = 60,
  dotRadius = 10,
}) => {
  const frame = useCurrentFrame();
  const maxFrames = timing.totalFrames;

  // Precompute cumulative phase table once across the entire timeline (1171 frames)
  const cumulativePhases = useMemo(() => {
    const totalCount = maxFrames + 1;
    const table = new Float64Array(totalCount);
    let accumulator = 0;
    for (let f = 0; f <= maxFrames; f++) {
      // Accumulate flowSpeed only after flow has started
      const speed = f >= flowStartFrame ? getState(f).flowSpeed : 0;
      accumulator += speed;
      table[f] = accumulator;
    }
    return table;
  }, [flowStartFrame, maxFrames]);

  // Deterministic phase(frame) helper: returns the exact continuous integral
  const phase = (f: number): number => {
    const clamped = Math.max(0, Math.min(maxFrames, f));
    const f0 = Math.floor(clamped);
    const f1 = Math.min(maxFrames, f0 + 1);
    const frac = clamped - f0;
    return cumulativePhases[f0] + (cumulativePhases[f1] - cumulativePhases[f0]) * frac;
  };

  // Fade in over 8 frames from flowStartFrame
  const flowOpacity = interpolate(
    frame,
    [flowStartFrame, flowStartFrame + 8],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // If before flow starts, do not render
  if (frame < flowStartFrame || flowOpacity <= 0) {
    return null;
  }

  // Precompute static dot positions based on continuous phase
  const totalLength = conventionalLoopLength;
  const numDots = Math.floor(totalLength / dotSpacing);
  const currentPhase = phase(frame);

  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < numDots; i++) {
    const rawDist = (currentPhase + i * dotSpacing) % totalLength;
    const dist = rawDist < 0 ? rawDist + totalLength : rawDist;
    const pt = getPointAtLength(conventionalLoopPath, dist);
    if (pt) {
      dots.push(pt);
    }
  }

  return (
    <g opacity={flowOpacity}>
      {/* Directional Arrowhead on top-right wire (centered at X=634, Y=80 pointing right) */}
      <polygon
        points="627,73 643,80 627,87"
        fill={theme.colors.green}
      />

      {/* Charge Carrier Dots: 10px radius, green, strictly flat (no glow, no shadows) */}
      {dots.map((pt, index) => (
        <circle
          key={index}
          cx={pt.x}
          cy={pt.y}
          r={dotRadius}
          fill={theme.colors.green}
        />
      ))}
    </g>
  );
};
