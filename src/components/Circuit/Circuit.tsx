import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../../theme";
import { easings, durations } from "../../motion";
import { Battery } from "./Battery";
import { Resistor } from "./Resistor";
import { Wire } from "./Wire";
import { CurrentFlow } from "./CurrentFlow";
import { CircuitCallouts } from "./CircuitCallouts";
import {
  topWirePath,
  topWireLength,
  returnWirePath,
  returnWireLength,
} from "./circuitPath";

export interface CircuitProps {
  startFrame?: number;
  animateEntrance?: boolean;
  highlightedComponent?: "none" | "voltage" | "resistance";
  showCurrentFlow?: boolean;
  flowStartFrame?: number;
  showCallouts?: boolean;
  resistorStrokeWidth?: number;
  width?: number;
  height?: number;
}

/**
 * 2D SVG Circuit Schematic with staggered entrance and integrated current flow:
 * - Hand-coded SVG Battery on left side
 * - Hand-coded SVG Resistor on top side
 * - Self-drawing wire path segments
 * - Pure phase-integral CurrentFlow dot animation
 */
export const Circuit: React.FC<CircuitProps> = ({
  startFrame = 0,
  animateEntrance = true,
  highlightedComponent = "none",
  showCurrentFlow = true,
  flowStartFrame = 120,
  showCallouts = false,
  resistorStrokeWidth,
  width = 900,
  height = 560,
}) => {
  const frame = useCurrentFrame();

  // Entrance timing stagger offsets
  const batteryStart = startFrame;
  const topWireStart = startFrame + durations.stagger;          // +5
  const resistorStart = startFrame + durations.stagger * 2;     // +10
  const returnWireStart = startFrame + durations.stagger * 3;   // +15

  // Battery progress (fade & subtle scale)
  const batteryProgress = animateEntrance
    ? interpolate(frame, [batteryStart, batteryStart + durations.enter], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easings.enter,
      })
    : 1;

  // Top wire self-drawing progress
  const topWireProgress = animateEntrance
    ? interpolate(frame, [topWireStart, topWireStart + durations.enter], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easings.enter,
      })
    : 1;

  // Resistor zigzag self-drawing progress
  const resistorProgress = animateEntrance
    ? interpolate(frame, [resistorStart, resistorStart + durations.enter], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easings.enter,
      })
    : 1;

  // Return wires self-drawing progress
  const returnWireProgress = animateEntrance
    ? interpolate(
        frame,
        [returnWireStart, returnWireStart + durations.enter],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easings.enter,
        }
      )
    : 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: "block",
        overflow: "visible",
      }}
    >
      {/* 1. Base Wire Paths */}
      <Wire
        path={topWirePath}
        length={topWireLength}
        progress={topWireProgress}
        color={theme.colors.ink}
      />

      <Wire
        path={returnWirePath}
        length={returnWireLength}
        progress={returnWireProgress}
        color={theme.colors.ink}
      />

      {/* 2. Resistor zigzag on top wire */}
      <Resistor
        progress={resistorProgress}
        opacity={resistorProgress > 0 ? 1 : 0}
        highlighted={highlightedComponent === "resistance"}
        strokeWidth={resistorStrokeWidth}
      />

      {/* 3. Battery on left wire */}
      <Battery
        opacity={batteryProgress}
        scale={0.92 + batteryProgress * 0.08}
        highlighted={highlightedComponent === "voltage"}
      />

      {/* 4. Moving green current flow dots along the conventional loop */}
      {showCurrentFlow && (
        <CurrentFlow flowStartFrame={flowStartFrame} />
      )}

      {/* 5. Scene 2 Technical Callouts */}
      {showCallouts && <CircuitCallouts />}
    </svg>
  );
};
