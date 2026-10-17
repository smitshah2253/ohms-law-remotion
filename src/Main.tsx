import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Manrope";
import { theme } from "./theme";
import { easings } from "./motion";
import { StudioBackground } from "./components/Layout/StudioBackground";
import { GridOverlay } from "./components/GridOverlay";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Circuit } from "./scenes/Scene2Circuit";
import { Scene3Voltage } from "./scenes/Scene3Voltage";
import { Scene4Resistance } from "./scenes/Scene4Resistance";
import { Scene5Rule } from "./scenes/Scene5Rule";

// Load Manrope weights: 500, 600, 800
const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "800"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export interface MainProps {
  showGrid?: boolean;
}

/** Smooth scene transition duration (10 frames ≈ 0.33s @ 30 fps). */
const TRANSITION = 10;

/**
 * Main Explainer Composition (1170 frames @ 30 fps, 1920×1080):
 * Scenes cross-dissolve with 10-frame overlapping transitions.
 * - Frames 0 – 120: Scene 1 Hook (built-in staggered exit)
 * - Frames 110 – 340: Scene 2 Circuit (entry 110-120, exit 330-340)
 * - Frames 330 – 550: Scene 3 Voltage (entry 330-340, exit 540-550)
 * - Frames 540 – 750: Scene 4 Resistance (entry 540-550, seamless exit)
 * - Frames 750 – 1170: Scene 5 Rule (built-in entrance animations)
 */
export const Main: React.FC<MainProps> = ({ showGrid = false }) => {
  const frame = useCurrentFrame();

  /* ── Cross-dissolve transition opacities ─────────────────────────
   * Each scene overlaps its neighbors by TRANSITION frames.
   * During overlap the outgoing scene fades out while the incoming fades in. */

  // Scene 2 (extended: 110 – 340)
  const s2Entry = interpolate(frame, [110, 110 + TRANSITION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const s2Exit = interpolate(frame, [340 - TRANSITION, 340], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const s2Opacity = Math.min(s2Entry, s2Exit);

  // Scene 3 (extended: 330 – 550)
  const s3Entry = interpolate(frame, [330, 330 + TRANSITION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const s3Exit = interpolate(frame, [550 - TRANSITION, 550], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const s3Opacity = Math.min(s3Entry, s3Exit);

  // Scene 4 (extended start: 540, ends at 750 — seamless handoff to Scene 5)
  const s4Opacity = interpolate(frame, [540, 540 + TRANSITION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        fontFamily,
      }}
    >
      {/* Premium Studio Technical Canvas Background */}
      <StudioBackground frame={frame} />

      {/* Scene 1: Hook (Frames 0 – 120) — built-in staggered exit */}
      {frame < 120 && <Scene1Hook startFrame={0} />}

      {/* Scene 2: Circuit (Frames 110 – 340, cross-dissolve transitions) */}
      {frame >= 110 && frame < 340 && (
        <AbsoluteFill style={{ opacity: s2Opacity }}>
          <Scene2Circuit />
        </AbsoluteFill>
      )}

      {/* Scene 3: Voltage (Frames 330 – 550, cross-dissolve transitions) */}
      {frame >= 330 && frame < 550 && (
        <AbsoluteFill style={{ opacity: s3Opacity }}>
          <Scene3Voltage />
        </AbsoluteFill>
      )}

      {/* Scene 4: Resistance (Frames 540 – 750, entry cross-dissolve) */}
      {frame >= 540 && frame < 750 && (
        <AbsoluteFill style={{ opacity: s4Opacity }}>
          <Scene4Resistance />
        </AbsoluteFill>
      )}

      {/* Scene 5: Rule & Takeaway (Frames 750 – 1170) — built-in entrance */}
      {frame >= 750 && <Scene5Rule />}

      {/* 12-Column Grid Overlay toggleable via showGrid prop */}
      {showGrid && <GridOverlay showGrid={showGrid} />}
    </AbsoluteFill>
  );
};
