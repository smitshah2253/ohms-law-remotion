import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { BatterySymbol } from "./BatterySymbol";
import { ResistorSymbol } from "./ResistorSymbol";
import { MetricBadge } from "./MetricBadge";
import { CircuitState } from "./types";

interface CircuitSchematicProps extends CircuitState {
  width?: number;
  height?: number;
  showLabels?: boolean;
  /** Function to retrieve current value at any frame for smooth phase integration */
  getCurrentAtFrame?: (frame: number) => number;
}

/**
 * 2D Technical SVG Circuit Schematic for robot actuator loops.
 * Features 6px wire strokes, 12px box corner radii, standard symbols,
 * and deterministic green current flow dashes.
 */
export const CircuitSchematic: React.FC<CircuitSchematicProps> = ({
  voltage,
  resistance,
  current,
  activeHighlight,
  flowActive,
  width = 820,
  height = 540,
  showLabels = true,
  getCurrentAtFrame,
}) => {
  const frame = useCurrentFrame();

  // Schematic wire geometry
  const wireLeft = 90;
  const wireRight = 730;
  const wireTop = 80;
  const wireBottom = 460;
  const cornerRadius = theme.geometry.boxCornerRadius; // 12px

  // Wire loop path in clockwise direction (starting from top center)
  // Top wire -> Right wire (through resistor) -> Bottom wire -> Left wire (through battery)
  const circuitPath = [
    `M ${(wireLeft + wireRight) / 2} ${wireTop}`,
    `H ${wireRight - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${wireRight} ${wireTop + cornerRadius}`,
    `V ${wireBottom - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${wireRight - cornerRadius} ${wireBottom}`,
    `H ${wireLeft + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${wireLeft} ${wireBottom - cornerRadius}`,
    `V ${wireTop + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${wireLeft + cornerRadius} ${wireTop}`,
    `Z`,
  ].join(" ");

  // Compute flow offset deterministically.
  // We integrate the frame speed to avoid phase-jumps when current magnitude changes.
  let flowOffset = 0;
  if (flowActive) {
    if (getCurrentAtFrame) {
      let accumulated = 0;
      for (let f = 0; f < frame; f++) {
        accumulated += getCurrentAtFrame(f) * 2.8;
      }
      flowOffset = -accumulated;
    } else {
      flowOffset = -frame * (current * 2.8);
    }
  }

  const isVoltageHighlighted = activeHighlight === "voltage";
  const isResistanceHighlighted = activeHighlight === "resistance";
  const isCurrentHighlighted = activeHighlight === "current";

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        boxSizing: "border-box",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }}
      >
        {/* Base Wire Loop (Neutral gray wire) */}
        <path
          d={circuitPath}
          fill="none"
          stroke={theme.colors.grayBorder}
          strokeWidth={theme.geometry.wireStrokeWidth}
          strokeLinecap={theme.geometry.strokeLinecap}
          strokeLinejoin={theme.geometry.strokeLinejoin}
        />

        {/* Dynamic Green Current Flow Stroke (Pure function of frame) */}
        {flowActive && (
          <path
            d={circuitPath}
            fill="none"
            stroke={theme.colors.green}
            strokeWidth={theme.geometry.wireStrokeWidth}
            strokeLinecap="round"
            strokeDasharray="20 34"
            strokeDashoffset={flowOffset}
          />
        )}

        {/* Direction Flow Chevrons (Clockwise) */}
        {/* Top Wire Chevron (Left -> Right) */}
        <polygon
          points={`${(wireLeft + wireRight) / 2 - 8},${wireTop - 8} ${(wireLeft + wireRight) / 2 + 8},${wireTop} ${(wireLeft + wireRight) / 2 - 8},${wireTop + 8}`}
          fill={flowActive ? theme.colors.green : theme.colors.grayMuted}
        />
        {/* Right Wire Chevron (Top -> Down) */}
        <polygon
          points={`${wireRight - 8},${(wireTop + wireBottom) / 2 + 90} ${wireRight},${(wireTop + wireBottom) / 2 + 106} ${wireRight + 8},${(wireTop + wireBottom) / 2 + 90}`}
          fill={flowActive ? theme.colors.green : theme.colors.grayMuted}
        />
        {/* Bottom Wire Chevron (Right -> Left) */}
        <polygon
          points={`${(wireLeft + wireRight) / 2 + 8},${wireBottom - 8} ${(wireLeft + wireRight) / 2 - 8},${wireBottom} ${(wireLeft + wireRight) / 2 + 8},${wireBottom + 8}`}
          fill={flowActive ? theme.colors.green : theme.colors.grayMuted}
        />
        {/* Left Wire Chevron (Down -> Top) */}
        <polygon
          points={`${wireLeft - 8},${(wireTop + wireBottom) / 2 - 90} ${wireLeft},${(wireTop + wireBottom) / 2 - 106} ${wireLeft + 8},${(wireTop + wireBottom) / 2 - 90}`}
          fill={flowActive ? theme.colors.green : theme.colors.grayMuted}
        />

        {/* Component Symbols (Mask wire underneath) */}
        {/* Battery DC Source on left branch */}
        <BatterySymbol
          x={wireLeft}
          y={(wireTop + wireBottom) / 2}
          isHighlighted={isVoltageHighlighted}
        />

        {/* Resistor Load on right branch */}
        <ResistorSymbol
          x={wireRight}
          y={(wireTop + wireBottom) / 2}
          isHighlighted={isResistanceHighlighted}
        />
      </svg>

      {/* Metric Badges overlayed with absolute coordinates */}
      {/* 1. Voltage Source Badge (Left) */}
      <div
        style={{
          position: "absolute",
          top: (wireTop + wireBottom) / 2 - 45,
          left: 10,
          transform: "translateX(-100%)",
        }}
      >
        <MetricBadge
          label="Voltage (V)"
          value={voltage}
          unit="V"
          isHighlighted={isVoltageHighlighted}
          subtitle={showLabels ? "DC Bus Supply" : undefined}
          width={180}
        />
      </div>

      {/* 2. Resistor Badge (Right) */}
      <div
        style={{
          position: "absolute",
          top: (wireTop + wireBottom) / 2 - 45,
          left: wireRight + 40,
        }}
      >
        <MetricBadge
          label="Resistance (R)"
          value={resistance}
          unit="Ω"
          isHighlighted={isResistanceHighlighted}
          subtitle={showLabels ? "Actuator Coil Load" : undefined}
          width={180}
        />
      </div>

      {/* 3. Current Flow Badge (Top Center) */}
      <div
        style={{
          position: "absolute",
          top: wireTop - 90,
          left: (wireLeft + wireRight) / 2 - 110,
        }}
      >
        <MetricBadge
          label="Current Flow (I)"
          value={current}
          unit="A"
          isHighlighted={isCurrentHighlighted}
          isEmphasis={flowActive && !isCurrentHighlighted}
          subtitle={showLabels ? "Rate of Electrical Flow" : undefined}
          width={220}
        />
      </div>
    </div>
  );
};
