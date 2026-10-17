import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { Stage } from "../components/Stage/Stage";
import { Circuit } from "../components/Circuit/Circuit";
import { getState } from "../state";
import { fadeUp, easings } from "../motion";

/**
 * Scene 3: Voltage Dynamics (Frames 330 - 540)
 * 
 * Rules:
 * - Persistent circuit on top of Stage (does not rebuild).
 * - Highlight state from getState turns Voltage readout amber at frames 345-360.
 * - Subtle scale pulse (1.0 -> 1.04 -> 1.0 over 12 frames) on Voltage number at frame 360-372.
 * - Current readout counts 3 -> 6 A in sync with voltage change (12 -> 24 V).
 * - Caption in lower left at frame 420 (fadeUp, 56px weight 800):
 *   Line 1: "More voltage," (ink)
 *   Line 2: "more current." (green)
 * - At frames 495-525 voltage returns to 12 V and caption fades out by 510.
 * - Current flow dots move at 24 px/f at frame 405 (twice as fast as 12 px/f at frame 350).
 */
export const Scene3Voltage: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getState(frame);

  // Subtle scale pulse (1.0 -> 1.04 -> 1.0 over 12 frames) right as voltage starts changing (frames 360-372)
  const voltageScale = interpolate(frame, [360, 366, 372], [1.0, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });

  // Lower-left caption entrance at frame 420
  const line1Entrance = fadeUp(frame, 420);
  const line2Entrance = fadeUp(frame, 426); // Stagger 6 frames

  // Caption exit between frames 495 and 510 (fades out as voltage returns to 12 V)
  const captionExitProgress = interpolate(frame, [495, 510], [0, 1], {
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
      voltageScale={voltageScale}
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
        highlightedComponent={state.highlight}
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
            More voltage,
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
            more current.
          </div>
        </div>
      )}
    </Stage>
  );
};
