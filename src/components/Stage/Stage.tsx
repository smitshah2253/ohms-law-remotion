import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";
import { ValueReadout } from "./ValueReadout";

export interface StageProps {
  voltage: number;
  current: number;
  resistance: number;
  highlight?: "none" | "voltage" | "resistance" | "current";
  panelOpacity?: number;
  voltageOpacity?: number;
  currentOpacity?: number;
  resistanceOpacity?: number;
  dividerOpacity?: number;
  voltageScale?: number;
  resistanceScale?: number;
  circuitOpacity?: number;
  children?: React.ReactNode;
}

/**
 * Persistent Stage layout for Scenes 2-5:
 * - Columns 1-7: Circuit graphics area (width 970px).
 * - Column 8: 2px gray divider centered at X = 1053px.
 * - Columns 9-12: Technical readout panel (width 544px, X = 1136px).
 *   Stacking Voltage (V), Current (I), and Resistance (R).
 */
export const Stage: React.FC<StageProps> = ({
  voltage,
  current,
  resistance,
  highlight = "none",
  panelOpacity = 1,
  voltageOpacity = 1,
  currentOpacity = 1,
  resistanceOpacity = 1,
  dividerOpacity,
  voltageScale,
  resistanceScale,
  circuitOpacity = 1,
  children,
}) => {
  // 12-column grid geometry constants
  const columnWidth = 118;
  const gutter = theme.layout.gutter; // 24px

  // Col 1-7: 7 * 118 + 6 * 24 = 970px
  const circuitAreaWidth = 7 * columnWidth + 6 * gutter;

  // Divider centered in Column 8: 970 + 24 + (118 / 2) = 1053px
  const dividerX = circuitAreaWidth + gutter + columnWidth / 2;

  // Col 9-12: 4 * 118 + 3 * 24 = 544px
  const panelWidth = 4 * columnWidth + 3 * gutter;
  const panelX = theme.layout.contentWidth - panelWidth; // 1136px

  const effectiveDividerOpacity = (dividerOpacity ?? panelOpacity) * panelOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        color: theme.colors.ink,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* 1680px Content Stage Container centered between 120px outer margins */}
      <div
        style={{
          position: "absolute",
          top: 100,
          bottom: 100,
          left: theme.layout.outerMarginX,
          width: theme.layout.contentWidth,
          boxSizing: "border-box",
        }}
      >
        {/* Left: Circuit Area (Columns 1-7) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: circuitAreaWidth,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            opacity: circuitOpacity,
          }}
        >
          {children}
        </div>

        {/* Column 8: Thin 2px Gray Divider */}
        <div
          style={{
            position: "absolute",
            top: 40,
            bottom: 40,
            left: dividerX - 1,
            width: 2,
            backgroundColor: theme.colors.grayBorder,
            opacity: effectiveDividerOpacity,
          }}
        />

        {/* Right: Readout Panel (Columns 9-12) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: panelX,
            width: panelWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 48,
            boxSizing: "border-box",
            paddingRight: theme.layout.spacingUnit * 2,
            opacity: panelOpacity,
          }}
        >
          {/* Row 1: Voltage (V) */}
          <div style={{ opacity: voltageOpacity }}>
            <ValueReadout
              label="Voltage"
              value={voltage}
              unit="V"
              highlighted={highlight === "voltage"}
              formatType="integer"
              scale={voltageScale}
            />
          </div>

          {/* Row 2: Current (I) */}
          <div style={{ opacity: currentOpacity }}>
            <ValueReadout
              label="Current"
              value={current}
              unit="A"
              highlighted={highlight === "current"}
              formatType="current"
            />
          </div>

          {/* Row 3: Resistance (R) */}
          <div style={{ opacity: resistanceOpacity }}>
            <ValueReadout
              label="Resistance"
              value={resistance}
              unit="Ω"
              highlighted={highlight === "resistance"}
              formatType="integer"
              scale={resistanceScale}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
