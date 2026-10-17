import React from "react";
import { theme } from "../../theme";

export interface ValueReadoutProps {
  label: string;
  value: number;
  unit: string;
  highlighted?: boolean;
  formatType?: "integer" | "current";
  scale?: number;
}

/**
 * Technical numerical readout row for the Stage panel.
 * 
 * Rules:
 * - Small gray label on top.
 * - Large number: 80px, weight 800, tabular figures.
 * - Unit beside the number in gray.
 * - 4px underline: amber when highlighted, otherwise ink.
 * - Number: amber when highlighted, otherwise ink.
 * - Format: voltage and resistance as integers; current with one decimal only when needed (3, 6, 1.5).
 */
export const ValueReadout: React.FC<ValueReadoutProps> = ({
  label,
  value,
  unit,
  highlighted = false,
  formatType,
  scale = 1,
}) => {
  // Format numbers:
  // - Voltage and resistance as integers
  // - Current with one decimal only when needed (3, 6, 1.5)
  let formattedValue: string;
  if (formatType === "integer") {
    formattedValue = Math.round(value).toString();
  } else if (formatType === "current") {
    const rounded = Math.round(value * 10) / 10;
    formattedValue = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  } else {
    // Auto-detection based on unit
    if (unit === "A") {
      const rounded = Math.round(value * 10) / 10;
      formattedValue = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
    } else {
      formattedValue = Math.round(value).toString();
    }
  }

  const activeColor = highlighted ? theme.colors.amber : theme.colors.ink;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Small gray label on top */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: theme.colors.grayMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: theme.layout.spacingUnit,
        }}
      >
        {label}
      </div>

      {/* Large number and unit row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1,
            color: activeColor,
            fontVariantNumeric: "tabular-nums",
            transform: scale && scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: "left baseline",
            display: "inline-block",
          }}
        >
          {formattedValue}
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1,
            color: theme.colors.grayMuted,
          }}
        >
          {unit}
        </span>
      </div>

      {/* 4px Underline */}
      <div
        style={{
          height: 4,
          width: "100%",
          backgroundColor: activeColor,
          marginTop: theme.layout.spacingUnit * 2,
        }}
      />
    </div>
  );
};
