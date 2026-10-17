import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../theme";
import { getState } from "../../state";
import { easings } from "../../motion";

interface StudioBackgroundProps {
  frame: number;
}

/**
 * Premium Studio Technical Canvas:
 * - Subtle radial gradient: pure white center softly transitioning to light architectural slate at edges
 * - Precision engineering dot matrix pattern (32px pitch)
 * - Corner registration marks and technician alignment crosshairs
 * - Contextual luminous ambient aura tracking the active circuit and state
 * - Clean technical metadata headers/footers
 */
export const StudioBackground: React.FC<StudioBackgroundProps> = ({ frame }) => {
  const state = getState(frame);

  // 12-column geometry
  const { outerMarginX, outerMarginY, contentWidth } = theme.layout;
  const stageTop = 100;
  const stageBottom = 980;
  const stageRight = outerMarginX + contentWidth;

  // Circuit ambient position tracking across scenes
  const initialCircuitX = outerMarginX + 970 / 2; // 605px
  const finalCircuitX = 1136 + 544 / 2; // 1408px
  const circuitY = 540;

  let circuitGlowX = initialCircuitX;
  if (frame >= 750 && frame <= 780) {
    const move = interpolate(frame, [750, 780], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easings.change,
    });
    circuitGlowX = interpolate(move, [0, 1], [initialCircuitX, finalCircuitX]);
  } else if (frame > 780) {
    circuitGlowX = finalCircuitX;
  }

  // Circuit glow intensity and color
  let glowColor = "rgba(0, 168, 107, 0.05)"; // Baseline emerald flow glow
  let glowRadius = 380;
  if (state.highlight === "voltage") {
    glowColor = "rgba(242, 169, 59, 0.08)"; // Warm voltage glow
    glowRadius = 420;
  } else if (state.highlight === "resistance") {
    glowColor = "rgba(242, 169, 59, 0.07)"; // Amber resistance focus
    glowRadius = 400;
  }

  const showCircuitGlow = frame >= 140;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        translate: "-3px 0px"
      }}
    >
      {/* 1. Base Studio Radial Gradient Surface */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 80% at 50% 46%, #FFFFFF 0%, #F8FAFD 50%, #EEF2F6 100%)",
        }}
      />

      {/* 2. Precision Engineering Dot Matrix Pattern (32px grid pitch) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id="studio-dot-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="16" cy="16" r="1.2" fill="#1F2933" fillOpacity="0.045" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#studio-dot-grid)" />
      </svg>

      {/* 3. Luminous Circuit Ambient Backlight */}
      {showCircuitGlow && (
        <div
          style={{
            position: "absolute",
            left: circuitGlowX - glowRadius,
            top: circuitY - glowRadius,
            width: glowRadius * 2,
            height: glowRadius * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(255,255,255,0) 70%)`,
            transition: "background 0.3s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 4. Top Technical Header / Metadata Bar */}

      {/* 5. Architectural Corner L-Brackets & Alignment Crosshairs */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Top-Left Corner Bracket */}
        <path
          d={`M ${outerMarginX} ${stageTop + 16} L ${outerMarginX} ${stageTop} L ${outerMarginX + 16} ${stageTop}`}
          fill="none"
          stroke={theme.colors.grayMuted}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Top-Right Corner Bracket */}
        <path
          d={`M ${stageRight - 16} ${stageTop} L ${stageRight} ${stageTop} L ${stageRight} ${stageTop + 16}`}
          fill="none"
          stroke={theme.colors.grayMuted}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Bottom-Left Corner Bracket */}
        <path
          d={`M ${outerMarginX} ${stageBottom - 16} L ${outerMarginX} ${stageBottom} L ${outerMarginX + 16} ${stageBottom}`}
          fill="none"
          stroke={theme.colors.grayMuted}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Bottom-Right Corner Bracket */}
        <path
          d={`M ${stageRight - 16} ${stageBottom} L ${stageRight} ${stageBottom} L ${stageRight} ${stageBottom - 16}`}
          fill="none"
          stroke={theme.colors.grayMuted}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Subtle Crosshairs at stage midpoints */}
        <g stroke={theme.colors.grayMuted} strokeWidth="1" opacity="0.4">
          {/* Top Divider Crosshair */}
          <line x1="1053" y1="94" x2="1053" y2="106" />
          <line x1="1047" y1="100" x2="1059" y2="100" />

          {/* Bottom Divider Crosshair */}
          <line x1="1053" y1="974" x2="1053" y2="986" />
          <line x1="1047" y1="980" x2="1059" y2="980" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
