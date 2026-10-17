import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../../theme";
import { fadeUp, easings } from "../../motion";

export interface CircuitCalloutsProps {
  startFrameVoltage?: number;    // Frame 185
  startFrameResistance?: number; // Frame 215
  startFrameCurrent?: number;    // Frame 245
  dimFrame?: number;             // Frame 285 - 300 (fades to 40%)
}

/**
 * Three technical callouts for Scene 2:
 * 1. "Voltage (V): the push" at the battery (Frame 185)
 * 2. "Resistance (R): the opposition" at the resistor (Frame 215)
 * 3. "Current (I): the flow" along the wire (Frame 245)
 * 
 * Rules:
 * - 3px leader line (strokeLinecap="round")
 * - 36px weight 600 labels
 * - Fade up one by one, 30 frames apart
 * - By frame 300, fade to 40% opacity so they stop competing for attention
 * - Perfectly balanced layout: no wire or dot overlap
 */
export const CircuitCallouts: React.FC<CircuitCalloutsProps> = ({
  startFrameVoltage = 185,
  startFrameResistance = 215,
  startFrameCurrent = 245,
  dimFrame = 285,
}) => {
  const frame = useCurrentFrame();

  // Dimming factor: fades from 1.0 down to 0.4 between frames 285 and 300
  const dimFactor = interpolate(frame, [dimFrame, dimFrame + 15], [1.0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });

  // Callout 1: Voltage (V): the push
  const vFade = fadeUp(frame, startFrameVoltage);
  const vOpacity = vFade.opacity * dimFactor;
  const vTranslateX = interpolate(frame, [startFrameVoltage, startFrameVoltage + 20], [-10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // Callout 2: Resistance (R): the opposition
  const rFade = fadeUp(frame, startFrameResistance);
  const rOpacity = rFade.opacity * dimFactor;
  const rTranslateY = interpolate(frame, [startFrameResistance, startFrameResistance + 20], [-12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // Callout 3: Current (I): the flow
  const iFade = fadeUp(frame, startFrameCurrent);
  const iOpacity = iFade.opacity * dimFactor;
  const iTranslateY = interpolate(frame, [startFrameCurrent, startFrameCurrent + 20], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  return (
    <g fontFamily={theme.typography.fontFamily}>
      {/* 1. Voltage Callout at Battery (X=150, Y=280) */}
      {vFade.opacity > 0 && (
        <g
          opacity={vOpacity}
          transform={`translate(${vTranslateX}, 0)`}
        >
          {/* Thin 3px leader line from battery terminal edge to text */}
          <line
            x1={182}
            y1={280}
            x2={214}
            y2={280}
            stroke={theme.colors.grayMuted}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Terminal dot on leader line */}
          <circle cx={182} cy={280} r={4} fill={theme.colors.grayMuted} />

          {/* Label: 36px, weight 600, ink */}
          <text
            x={226}
            y={292}
            fontSize={36}
            fontWeight={600}
            fill={theme.colors.ink}
            textAnchor="start"
          >
            Voltage (V): the push
          </text>
        </g>
      )}

      {/* 2. Resistance Callout below Resistor (X=450, Y=80) */}
      {rFade.opacity > 0 && (
        <g
          opacity={rOpacity}
          transform={`translate(0, ${rTranslateY})`}
        >
          {/* Thin 3px leader line from resistor bottom peak down to text */}
          <line
            x1={450}
            y1={108}
            x2={450}
            y2={138}
            stroke={theme.colors.grayMuted}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={450} cy={108} r={4} fill={theme.colors.grayMuted} />

          {/* Label: 36px, weight 600, ink */}
          <text
            x={450}
            y={172}
            fontSize={36}
            fontWeight={600}
            fill={theme.colors.ink}
            textAnchor="middle"
          >
            Resistance (R): the opposition
          </text>
        </g>
      )}

      {/* 3. Current Callout above Bottom Wire (X=450, Y=480) */}
      {iFade.opacity > 0 && (
        <g
          opacity={iOpacity}
          transform={`translate(0, ${iTranslateY})`}
        >
          {/* Thin 3px leader line from bottom wire up to text */}
          <line
            x1={450}
            y1={466}
            x2={450}
            y2={436}
            stroke={theme.colors.green}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={450} cy={466} r={4} fill={theme.colors.green} />

          {/* Label: 36px, weight 600, green (strictly for current/flow emphasis) */}
          <text
            x={450}
            y={418}
            fontSize={36}
            fontWeight={600}
            fill={theme.colors.green}
            textAnchor="middle"
          >
            Current (I): the flow
          </text>
        </g>
      )}
    </g>
  );
};
