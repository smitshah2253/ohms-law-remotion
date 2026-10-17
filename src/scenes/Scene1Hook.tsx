import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { fadeUp, easings } from "../motion";

export interface Scene1HookProps {
  startFrame?: number; // Default 0
}

/**
 * Scene 1: Hook (Frames 0 - 120)
 * 
 * Rules:
 * - Left-aligned at Column 1, vertically around 40% height.
 * - Line 1: "What decides how much" (Hero 96px, weight 800, ink #1F2933)
 * - Line 2: "current flows?" (Hero 96px, weight 800, green #00A86B)
 * - Staggered entrance by 8 frames with fadeUp, starting frame 10.
 * - Held fully visible from frame 45 to 90.
 * - At frames 90-110, slides up 24px and fades to 0.
 * - No typewriter effect, no letter animation.
 */
export const Scene1Hook: React.FC<Scene1HookProps> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  // If outside Scene 1 active range, do not render
  if (relFrame < 0 || relFrame > 120) {
    return null;
  }

  // Entrance animations via fadeUp helper (translateY 16 -> 0, opacity 0 -> 1)
  const line1Entrance = fadeUp(relFrame, 10);
  const line2Entrance = fadeUp(relFrame, 18); // 8-frame stagger

  // Exit animation across frames 90 to 110 (slides up 24px, fades to 0)
  const exitProgress = interpolate(relFrame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  const exitOpacity = 1 - exitProgress;
  const exitOffsetY = -24 * exitProgress;

  // Combined transforms and opacities
  const line1Opacity = line1Entrance.opacity * exitOpacity;
  const line1TranslateY = line1Entrance.translateY + exitOffsetY;

  const line2Opacity = line2Entrance.opacity * exitOpacity;
  const line2TranslateY = line2Entrance.translateY + exitOffsetY;

  return (
    <div
      style={{
        position: "absolute",
        top: "38%",
        left: theme.layout.outerMarginX, // Column 1 boundary (120px)
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
          fontSize: theme.fontSizes.hero,
          fontWeight: theme.typography.weights.headline,
          color: theme.colors.ink,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
        }}
      >
        What decides how much
      </div>

      {/* Line 2: green color (#00A86B - strictly for current/flow emphasis) */}
      <div
        style={{
          opacity: line2Opacity,
          transform: `translateY(${line2TranslateY}px)`,
          fontSize: theme.fontSizes.hero,
          fontWeight: theme.typography.weights.headline,
          color: theme.colors.green,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginTop: theme.layout.spacingUnit,
        }}
      >
        current flows?
      </div>
    </div>
  );
};
