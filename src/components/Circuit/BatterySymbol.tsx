import React from "react";
import { theme } from "../../theme";

interface BatterySymbolProps {
  x: number;
  y: number;
  isHighlighted?: boolean;
}

/**
 * Standard DC Battery schematic symbol for robotics power bus.
 * Composed of alternating long/short parallel plates with terminal polarity.
 */
export const BatterySymbol: React.FC<BatterySymbolProps> = ({
  x,
  y,
  isHighlighted = false,
}) => {
  const strokeColor = isHighlighted ? theme.colors.amber : theme.colors.ink;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Top terminal lead */}
      <line
        x1={0}
        y1={-60}
        x2={0}
        y2={-32}
        stroke={theme.colors.ink}
        strokeWidth={theme.geometry.wireStrokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Positive Terminal (+) Indicator */}
      <text
        x={-28}
        y={-20}
        fill={strokeColor}
        fontFamily={theme.typography.fontFamily}
        fontWeight={800}
        fontSize={20}
        textAnchor="middle"
      >
        +
      </text>

      {/* Cell 1: Long plate (+) */}
      <line
        x1={-30}
        y1={-24}
        x2={30}
        y2={-24}
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Cell 1: Short thick plate (-) */}
      <line
        x1={-16}
        y1={-10}
        x2={16}
        y2={-10}
        stroke={strokeColor}
        strokeWidth={8}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Cell 2: Long plate (+) */}
      <line
        x1={-30}
        y1={8}
        x2={30}
        y2={8}
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Cell 2: Short thick plate (-) */}
      <line
        x1={-16}
        y1={22}
        x2={16}
        y2={22}
        stroke={strokeColor}
        strokeWidth={8}
        strokeLinecap={theme.geometry.strokeLinecap}
      />

      {/* Negative Terminal (-) Indicator */}
      <text
        x={-28}
        y={28}
        fill={strokeColor}
        fontFamily={theme.typography.fontFamily}
        fontWeight={800}
        fontSize={24}
        textAnchor="middle"
      >
        −
      </text>

      {/* Bottom terminal lead */}
      <line
        x1={0}
        y1={30}
        x2={0}
        y2={60}
        stroke={theme.colors.ink}
        strokeWidth={theme.geometry.wireStrokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
      />
    </g>
  );
};
