import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { Stage } from "../components/Stage/Stage";
import { Circuit } from "../components/Circuit/Circuit";
import { getState } from "../state";
import { fadeUp, easings } from "../motion";

/**
 * Scene 4: Resistance Dynamics (Frames 540 - 750)
 * 
 * Rules:
 * - Persistent circuit on top of Stage (mirrored structure to Scene 3).
 * - Resistance readout goes amber at frames 555-570.
 * - Subtle scale pulse (1.0 -> 1.04 -> 1.0 over 12 frames) on Resistance number at frames 570-582.
 * - Resistance counts 4 -> 8 Ω over 45 frames (570-615).
 * - Current readout counts 3 -> 1.5 A in sync (computed voltage / resistance).
 * - Dots slow down to half speed (12 -> 6 px/f) seamlessly via phase integration.
 * - One extra visual cue on the resistor only: subtle stroke-width increase 6 -> 9px
 *   driven by resistance via interpolate (representing a "narrower path"). Resistor remains ink.
 * - Caption in lower left at frame 630 (fadeUp, 56px weight 800):
 *   Line 1: "More resistance," (ink)
 *   Line 2: "less current." (green)
 * - Everything fades gently to the neutral state by frame 735:
 *   Caption exits at 705-725, resistance returns 8 -> 4 Ω at 705-735, highlight off by 735.
 */
export const Scene4Resistance: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getState(frame);

  // Subtle scale pulse (1.0 -> 1.04 -> 1.0 over 12 frames) right as resistance starts changing (frames 570-582)
  const resistanceScale = interpolate(frame, [570, 576, 582], [1.0, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });

  // Extra visual cue on the resistor only: stroke-width increase 6 -> 9px driven by resistance
  const resistorStrokeWidth = interpolate(state.resistance, [4, 8], [6, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lower-left caption entrance at frame 630
  const line1Entrance = fadeUp(frame, 630);
  const line2Entrance = fadeUp(frame, 636); // Stagger 6 frames

  // Caption exit between frames 705 and 725 (fades out gently before frame 735 neutral baseline)
  const captionExitProgress = interpolate(frame, [705, 725], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const captionExitOpacity = 1 - captionExitProgress;
  const captionExitOffsetY = -16 * captionExitProgress;

  const line1Opacity = line1Entrance.opacity * captionExitOpacity;
  const line1TranslateY = line1Entrance.translateY + captionExitOffsetY;

  const line2Opacity = line2Entrance.opacity * captionExitOpacity;
  const line2TranslateY = line2Entrance.translateY + captionExitOffsetY;

  const isCaptionVisible = line1Opacity > 0 || line2Opacity > 0;

  return (
    <Stage
      voltage={state.voltage}
      current={state.current}
      resistance={state.resistance}
      highlight={state.highlight}
      resistanceScale={resistanceScale}
      panelOpacity={1}
      voltageOpacity={1}
      currentOpacity={1}
      resistanceOpacity={1}
      dividerOpacity={1}
    >
      {/* Persistent Hand-Coded SVG Circuit & Integrated Current Flow */}
      <Circuit
        startFrame={120}
        flowStartFrame={165}
        showCurrentFlow={true}
        showCallouts={false}
        highlightedComponent="none"
        resistorStrokeWidth={resistorStrokeWidth}
      />

      {/* Lower Left Caption (Columns 1-7, below bottom wire) */}
      {isCaptionVisible && (
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            fontFamily: theme.typography.fontFamily,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Line 1: ink color (#1F2933) */}
          <div
            style={{
              opacity: line1Opacity,
              transform: `translateY(${line1TranslateY}px)`,
              fontSize: 56,
              fontWeight: 800,
              color: theme.colors.ink,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            More resistance,
          </div>

          {/* Line 2: green color (#00A86B - strictly for current/flow emphasis) */}
          <div
            style={{
              opacity: line2Opacity,
              transform: `translateY(${line2TranslateY}px)`,
              fontSize: 56,
              fontWeight: 800,
              color: theme.colors.green,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            less current.
          </div>
        </div>
      )}
    </Stage>
  );
};
