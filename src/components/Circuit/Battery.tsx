import React from "react";
import { theme } from "../../theme";
import { circuitGeometry } from "./circuitPath";

export interface BatteryProps {
  opacity?: number;
  scale?: number;
  highlighted?: boolean;
}

/**
 * Technical DC Battery schematic symbol.
 * - Two plates: long thin line = positive (+), short thick line = negative (-).
 * - Polarity text marks (+ and -).
 * - Ink color, strictly flat, no box.
 */
export const Battery: React.FC<BatteryProps> = ({
  opacity = 1,
  scale = 1,
  highlighted = false,
}) => {
  const { centerX, centerY, topTerminalY, bottomTerminalY } = circuitGeometry.battery;
  const strokeColor = highlighted ? theme.colors.amber : theme.colors.ink;

  // Plate vertical positions
  const positivePlateY = centerY - 8; // Y = 272
  const negativePlateY = centerY + 8; // Y = 288

  return (
    <g
      opacity={opacity}
      transform={
        scale !== 1
          ? `translate(${centerX}, ${centerY}) scale(${scale}) translate(-${centerX}, -${centerY})`
          : undefined
      }
    >
      {/* Top Terminal Lead (6px wire connecting to topTerminalY = 240) */}
      <line
        x1={centerX}
        y1={topTerminalY}
        x2={centerX}
        y2={positivePlateY}
        stroke={strokeColor}
        strokeWidth={theme.strokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Positive Terminal (+) Text Mark */}
      <text
        x={centerX - 42}
        y={positivePlateY + 7}
        fill={strokeColor}
        fontFamily={theme.typography.fontFamily}
        fontWeight={800}
        fontSize={28}
        textAnchor="middle"
      >
        +
      </text>

      {/* Positive Plate: Long thin horizontal line (width 56px, stroke 4px) */}
      <line
        x1={centerX - 28}
        y1={positivePlateY}
        x2={centerX + 28}
        y2={positivePlateY}
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Negative Plate: Short thick horizontal line (width 26px, stroke 10px) */}
      <line
        x1={centerX - 13}
        y1={negativePlateY}
        x2={centerX + 13}
        y2={negativePlateY}
        stroke={strokeColor}
        strokeWidth={10}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Negative Terminal (-) Text Mark */}
      <text
        x={centerX - 42}
        y={negativePlateY + 6}
        fill={strokeColor}
        fontFamily={theme.typography.fontFamily}
        fontWeight={800}
        fontSize={34}
        textAnchor="middle"
      >
        −
      </text>

      {/* Bottom Terminal Lead (6px wire connecting to bottomTerminalY = 320) */}
      <line
        x1={centerX}
        y1={negativePlateY}
        x2={centerX}
        y2={bottomTerminalY}
        stroke={strokeColor}
        strokeWidth={theme.strokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
      />
    </g>
  );
};
