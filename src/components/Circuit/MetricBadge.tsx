import React from "react";
import { theme } from "../../theme";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit: string;
  isHighlighted?: boolean;
  isEmphasis?: boolean; // Used for green current/flow emphasis
  subtitle?: string;
  width?: number;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  isHighlighted = false,
  isEmphasis = false,
  subtitle,
  width = 200,
}) => {
  // Border color priority:
  // 1. Amber (strictly for value actively changing)
  // 2. Green (strictly for current/flow key emphasis)
  // 3. Gray border default
  const borderColor = isHighlighted
    ? theme.colors.amber
    : isEmphasis
    ? theme.colors.green
    : theme.colors.grayBorder;

  const valueColor = isHighlighted
    ? theme.colors.amber
    : isEmphasis
    ? theme.colors.green
    : theme.colors.ink;

  const labelColor = isHighlighted
    ? theme.colors.amber
    : theme.colors.grayMuted;

  return (
    <div
      style={{
        width,
        backgroundColor: theme.colors.background,
        border: `2px solid ${borderColor}`,
        borderRadius: theme.geometry.boxCornerRadius,
        padding: `${theme.layout.spacingUnit * 1.5}px ${theme.layout.spacingUnit * 2}px`,
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <div
        style={{
          ...theme.typography.labelSmall,
          color: labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span
          style={{
            ...theme.typography.metricValue,
            color: valueColor,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {typeof value === "number" ? value.toFixed(1) : value}
        </span>
        <span
          style={{
            ...theme.typography.label,
            color: theme.colors.grayMuted,
            fontWeight: 600,
          }}
        >
          {unit}
        </span>
      </div>

      {subtitle && (
        <div
          style={{
            ...theme.typography.labelSmall,
            color: theme.colors.grayMuted,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
