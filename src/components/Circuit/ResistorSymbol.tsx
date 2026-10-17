import React from "react";
import { theme } from "../../theme";

interface ResistorSymbolProps {
  x: number;
  y: number;
  isHighlighted?: boolean;
}

/**
 * Standard IEC/IEEE Resistor schematic symbol representing robotic actuator resistance.
 * Precision SVG zigzag with 6px stroke and rounded joins.
 */
export const ResistorSymbol: React.FC<ResistorSymbolProps> = ({
  x,
  y,
  isHighlighted = false,
}) => {
  const strokeColor = isHighlighted ? theme.colors.amber : theme.colors.ink;

  // Precision 6-peak zigzag path
  const zigzagPath = [
    "M 0 -60",
    "L 0 -40",
    "L -20 -30",
    "L 20 -15",
    "L -20 0",
    "L 20 15",
    "L -20 30",
    "L 0 40",
    "L 0 60",
  ].join(" ");

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Background backing rect to ensure clean isolation */}
      <rect
        x={-28}
        y={-48}
        width={56}
        height={96}
        fill={theme.colors.background}
      />

      <path
        d={zigzagPath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={theme.geometry.wireStrokeWidth}
        strokeLinecap={theme.geometry.strokeLinecap}
        strokeLinejoin={theme.geometry.strokeLinejoin}
      />
    </g>
  );
};
