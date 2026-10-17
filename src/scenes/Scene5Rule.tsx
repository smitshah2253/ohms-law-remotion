import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, interpolateColors } from "remotion";
import { theme } from "../theme";
import { getState } from "../state";
import { fadeUp, easings, durations } from "../motion";
import { Circuit } from "../components/Circuit/Circuit";
import { ValueReadout } from "../components/Stage/ValueReadout";

/**
 * Scene 5: Rule & Technician Takeaway (Frames 750 - 1170)
 * Part 1: Layout and Intro (Frames 750 - 825)
 * 
 * Layout:
 * - Left, Columns 1-7 (width 970px): Explanation area
 * - Center, Column 8: 2px gray divider at X = 1053px
 * - Right, Columns 9-12 (width 544px): Half-scale live circuit (0.5x) with CurrentFlow dots
 * - Transition: Old readout panel fades out over 750-775; circuit smoothly glides from left to right (750-780, 30 frames, change easing)
 * 
 * The Fraction (The Main Visual):
 * - Symbolic fraction left-aligned around 40% height: "I =" then stacked fraction V (amber #F2A93B) over 6px bar and R (ink #1F2933), I green (#00A86B). 120px weight 800.
 * - Numeric line directly beneath: 72px weight 600, 3 A = 12 V over 4 Ω (animated from getState, tabular figures).
 * - Plain-language line: 40px weight 600, gray: "Current = push ÷ opposition" (push amber, opposition ink).
 * - Current bar: 24px-high rounded bar, green, width = current * 100px with 0-6 A faint track and value to right.
 * 
 * Intro Timing (750-825):
 * - 775: Symbolic fraction fades up (fadeUp), letters staggered 6 frames.
 * - 790: Numeric line fades up.
 * - 800: Plain-language line fades up.
 * - 810: Current bar draws in from the left.
 */
export const Scene5Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getState(frame);

  // 12-column grid geometry constants
  const columnWidth = 118;
  const gutter = theme.layout.gutter; // 24px
  const circuitAreaWidth = 7 * columnWidth + 6 * gutter; // 970px
  const dividerX = circuitAreaWidth + gutter + columnWidth / 2; // 1053px
  const panelWidth = 4 * columnWidth + 3 * gutter; // 544px
  const panelX = theme.layout.contentWidth - panelWidth; // 1136px

  // Center coordinates for moving circuit
  const circuitInitialX = circuitAreaWidth / 2; // 485px (centered in Columns 1-7)
  const circuitFinalX = panelX + panelWidth / 2; // 1408px (centered in Columns 9-12)
  const circuitY = (theme.layout.height - theme.layout.outerMarginY * 2) / 2; // 440px

  // Circuit transition over frames 750-780 (30 frames, change easing)
  const moveProgress = interpolate(frame, [750, 780], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });
  const circuitX = interpolate(moveProgress, [0, 1], [circuitInitialX, circuitFinalX]);
  const circuitScale = interpolate(moveProgress, [0, 1], [1.0, 0.5]);

  // Old readout panel fade-out over frames 750-775
  const oldPanelOpacity = interpolate(frame, [750, 775], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });

  // Dynamic resistor stroke width driven by resistance (6 -> 9px)
  const resistorStrokeWidth = interpolate(state.resistance, [4, 8], [6, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Intro Animation Timing (Frames 750-825)
  // 1. Symbolic Fraction (frame 775, 6-frame stagger)
  const fadeI = fadeUp(frame, 775);
  const fadeV = fadeUp(frame, 781);
  const fadeR = fadeUp(frame, 787);

  // 2. Numeric Line (frame 790)
  const fadeNumeric = fadeUp(frame, 790);

  // 3. Plain-language Line (frame 800)
  const fadePlain = fadeUp(frame, 800);

  // 4. Current Bar draw-in from left (frame 810, 20 frames)
  const barProgress = interpolate(frame, [810, 830], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // =========================================================================
  // VoltageEffect Animations (Frames 825-945)
  // =========================================================================

  // 1. Voltage Amber Highlight Progress (825-837 entrance over 8 frames, hold to 915, fade out 915-945)
  let vAmberProgress = 0;
  if (frame >= 825 && frame <= 833) {
    vAmberProgress = interpolate(frame, [825, 833], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame > 833 && frame <= 915) {
    vAmberProgress = 1;
  } else if (frame > 915 && frame <= 945) {
    vAmberProgress = interpolate(frame, [915, 945], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Dynamic colors for highlighted voltage elements
  const vColor = interpolateColors(
    vAmberProgress,
    [0, 1],
    [theme.colors.ink, theme.colors.amber]
  );
  const vNumColor = interpolateColors(
    vAmberProgress,
    [0, 1],
    [theme.colors.ink, theme.colors.amber]
  );
  const vUnitColor = interpolateColors(
    vAmberProgress,
    [0, 1],
    [theme.colors.grayMuted, theme.colors.amber]
  );
  const pushColor = interpolateColors(
    vAmberProgress,
    [0, 1],
    [theme.colors.grayMuted, theme.colors.amber]
  );

  // 2. Voltage Directional SVG Arrows (no emoji)
  // Amber triangle pointing up beside V (appears at 837, holds to 915, fades out by 930)
  const arrowVIn = interpolate(frame, [837, 841], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowVExit = interpolate(frame, [915, 930], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowVOpacity = arrowVIn * arrowVExit;
  const arrowVTranslateY = interpolate(arrowVIn, [0, 1], [4, 0]);

  // Green triangle pointing up beside I (appears at 850, holds to 915, fades out by 930)
  const arrowVIIn = interpolate(frame, [850, 854], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowVIOpacity = arrowVIIn * arrowVExit;
  const arrowVITranslateY = interpolate(arrowVIIn, [0, 1], [4, 0]);

  // 3. Voltage Proportionality Badges ("×2"):
  // Fades in at 870, reaches full visibility at 882, fades out between 915 and 925
  const vBadgeIn = interpolate(frame, [870, 882], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vBadgeOut = interpolate(frame, [915, 925], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vBadgeOpacity = vBadgeIn * vBadgeOut;

  // 4. Voltage Hint under numeric line (Frames 880-925: "Bigger top, bigger answer.")
  const vHintIn = interpolate(frame, [880, 888], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vHintOut = interpolate(frame, [915, 925], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vHintOpacity = vHintIn * vHintOut;

  // 5. Voltage Lower-Left Caption (Frame 860, 56px weight 800, stagger 8 frames, exit by 930)
  const vLine1In = fadeUp(frame, 860);
  const vLine2In = fadeUp(frame, 868);
  const vCaptionExitProgress = interpolate(frame, [915, 930], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });
  const vCaptionExitOpacity = 1 - vCaptionExitProgress;
  const vCaptionExitOffsetY = -12 * vCaptionExitProgress;

  const vLine1Opacity = vLine1In.opacity * vCaptionExitOpacity;
  const vLine1TranslateY = vLine1In.translateY + vCaptionExitOffsetY;

  const vLine2Opacity = vLine2In.opacity * vCaptionExitOpacity;
  const vLine2TranslateY = vLine2In.translateY + vCaptionExitOffsetY;

  const vCaptionVisible = frame >= 860 && frame <= 930;

  // =========================================================================
  // ResistanceEffect Animations (Frames 945-1065)
  // =========================================================================

  // 1. Resistance Amber Highlight Progress (945-957 entrance over 8 frames, hold to 1035, fade out 1035-1065)
  let rAmberProgress = 0;
  if (frame >= 945 && frame <= 953) {
    rAmberProgress = interpolate(frame, [945, 953], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame > 953 && frame <= 1035) {
    rAmberProgress = 1;
  } else if (frame > 1035 && frame <= 1065) {
    rAmberProgress = interpolate(frame, [1035, 1065], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Dynamic colors for highlighted resistance elements
  const rColor = interpolateColors(
    rAmberProgress,
    [0, 1],
    [theme.colors.ink, theme.colors.amber]
  );
  const rNumColor = interpolateColors(
    rAmberProgress,
    [0, 1],
    [theme.colors.ink, theme.colors.amber]
  );
  const rUnitColor = interpolateColors(
    rAmberProgress,
    [0, 1],
    [theme.colors.grayMuted, theme.colors.amber]
  );
  const oppositionColor = interpolateColors(
    rAmberProgress,
    [0, 1],
    [theme.colors.grayMuted, theme.colors.amber]
  );

  // 2. Resistance Directional SVG Arrows (no emoji)
  // Amber triangle pointing up beside R (appears at 957, holds to 1035, fades out by 1050)
  const arrowRIn = interpolate(frame, [957, 961], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowRExit = interpolate(frame, [1035, 1050], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowROpacity = arrowRIn * arrowRExit;
  const arrowRTranslateY = interpolate(arrowRIn, [0, 1], [4, 0]);

  // Green triangle pointing DOWN beside I (appears at 970, holds to 1035, fades out by 1050)
  const arrowRIIn = interpolate(frame, [970, 974], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowRIOpacity = arrowRIIn * arrowRExit;
  const arrowRITranslateY = interpolate(arrowRIIn, [0, 1], [-4, 0]);

  // 3. Resistance Proportionality Badges ("×2" beside R, "÷2" beside I):
  // Fades in at 990, reaches full visibility at 1002, fades out between 1035 and 1045
  const rBadgeIn = interpolate(frame, [990, 1002], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rBadgeOut = interpolate(frame, [1035, 1045], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rBadgeOpacity = rBadgeIn * rBadgeOut;

  // 4. Resistance Hint under numeric line (Frames 1000-1045: "Bigger bottom, smaller answer.")
  const rHintIn = interpolate(frame, [1000, 1008], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rHintOut = interpolate(frame, [1035, 1045], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rHintOpacity = rHintIn * rHintOut;

  // 5. Resistance Lower-Left Caption (Frame 980, 56px weight 800, stagger 8 frames, exit by 1050)
  const rLine1In = fadeUp(frame, 980);
  const rLine2In = fadeUp(frame, 988);
  const rCaptionExitProgress = interpolate(frame, [1035, 1050], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });
  const rCaptionExitOpacity = 1 - rCaptionExitProgress;
  const rCaptionExitOffsetY = -12 * rCaptionExitProgress;

  const rLine1Opacity = rLine1In.opacity * rCaptionExitOpacity;
  const rLine1TranslateY = rLine1In.translateY + rCaptionExitOffsetY;

  const rLine2Opacity = rLine2In.opacity * rCaptionExitOpacity;
  const rLine2TranslateY = rLine2In.translateY + rCaptionExitOffsetY;

  const rCaptionVisible = frame >= 980 && frame <= 1050;

  // =========================================================================
  // Summary Section Animations (Frames 1065-1170)
  // =========================================================================

  // 1. Math Visual fade out completely to 0% opacity over 1065-1085 (no background text overlap)
  const mathOpacity = interpolate(frame, [1065, 1085], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.change,
  });

  // 2. Summary Row 1 (Frame 1075, entrance over 10 frames)
  const row1Opacity = interpolate(frame, [1075, 1085], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const row1TranslateY = interpolate(frame, [1075, 1085], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // 3. Summary Row 2 (Frame 1085, staggered 10 frames, entrance over 10 frames)
  const row2Opacity = interpolate(frame, [1085, 1095], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const row2TranslateY = interpolate(frame, [1085, 1095], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // 4. Rearranged rule line (Frame 1115, entrance over 10 frames)
  const rearrangedLineOpacity = interpolate(frame, [1115, 1125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const rearrangedLineTranslateY = interpolate(frame, [1115, 1125], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // 5. Hero equation "V = I × R" (Frame 1125, entrance over 10 frames)
  const heroEqOpacity = interpolate(frame, [1125, 1135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });
  const heroEqTranslateY = interpolate(frame, [1125, 1135], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings.enter,
  });

  // Current values formatting
  const formattedCurrent = state.current % 1 === 0
    ? state.current.toFixed(0)
    : state.current.toFixed(1);

  const activeBarWidth = state.current * 100 * barProgress;

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
          top: theme.layout.outerMarginY,
          bottom: theme.layout.outerMarginY,
          left: theme.layout.outerMarginX,
          width: theme.layout.contentWidth,
          boxSizing: "border-box",
        }}
      >
        {/* ========================================================================= */}
        {/* LEFT: EXPLANATION AREA (Columns 1-7, width 970px)                         */}
        {/* ========================================================================= */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: circuitAreaWidth,
            boxSizing: "border-box",
          }}
        >
          {/* MATH VISUAL (Fades out completely over 1065-1085) */}
          {mathOpacity > 0 && (
            <div
              style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              boxSizing: "border-box",
              paddingTop: 80,
              paddingLeft: 0,
              opacity: mathOpacity,
              pointerEvents: "none",
            }}
          >
          {/* 1. THE SYMBOLIC FRACTION (Around 40% height, 120px, weight 800) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            {/* Left: I [arrow + badge] = */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                opacity: fadeI.opacity,
                transform: `translateY(${fadeI.translateY}px)`,
              }}
            >
              {/* Symbolic I (Green) */}
              <span
                style={{
                  fontSize: 120,
                  fontWeight: 800,
                  color: theme.colors.green,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                I
              </span>

              {/* Current Arrow + Proportionality Badge Container (fixed space so '=' never jitters) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginLeft: 14,
                  marginRight: 16,
                  minWidth: 70,
                }}
              >
                {/* Voltage section: Green Up Triangle beside I */}
                {frame < 945 && (
                  <div
                    style={{
                      opacity: arrowVIOpacity,
                      transform: `translateY(${arrowVITranslateY}px)`,
                    }}
                  >
                    <svg width={18} height={20} viewBox="0 0 18 20" style={{ display: "block" }}>
                      <polygon points="9,2 17,18 1,18" fill={theme.colors.green} />
                    </svg>
                  </div>
                )}

                {/* Resistance section: Green Down Triangle beside I */}
                {frame >= 945 && (
                  <div
                    style={{
                      opacity: arrowRIOpacity,
                      transform: `translateY(${arrowRITranslateY}px)`,
                    }}
                  >
                    <svg width={18} height={20} viewBox="0 0 18 20" style={{ display: "block" }}>
                      <polygon points="9,18 17,2 1,2" fill={theme.colors.green} />
                    </svg>
                  </div>
                )}

                {/* Voltage section: "×2" proportionality label beside I arrow */}
                {frame < 945 && (
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: theme.colors.grayMuted,
                      opacity: vBadgeOpacity,
                      lineHeight: 1,
                    }}
                  >
                    ×2
                  </div>
                )}

                {/* Resistance section: "÷2" proportionality label beside I arrow */}
                {frame >= 945 && (
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: theme.colors.grayMuted,
                      opacity: rBadgeOpacity,
                      lineHeight: 1,
                    }}
                  >
                    ÷2
                  </div>
                )}
              </div>

              {/* Equals sign */}
              <span
                style={{
                  fontSize: 120,
                  fontWeight: 800,
                  color: theme.colors.ink,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                =
              </span>
            </div>

            {/* Stacked Fraction: V over R */}
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Numerator: V with amber underline, arrow, and ×2 label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  width: "100%",
                }}
              >
                {/* Letter V with 4px underline */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: fadeV.opacity,
                    transform: `translateY(${fadeV.translateY}px)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 120,
                      fontWeight: 800,
                      lineHeight: 1,
                      color: vColor,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    V
                  </span>

                  {/* 4px Amber Underline under V */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: theme.colors.amber,
                      borderRadius: 2,
                      opacity: vAmberProgress,
                    }}
                  />
                </div>

                {/* Voltage Arrow + Proportionality Badge beside V */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% + 46px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Amber Up Triangle beside V */}
                  <div
                    style={{
                      opacity: arrowVOpacity,
                      transform: `translateY(${arrowVTranslateY}px)`,
                    }}
                  >
                    <svg width={18} height={20} viewBox="0 0 18 20" style={{ display: "block" }}>
                      <polygon points="9,2 17,18 1,18" fill={theme.colors.amber} />
                    </svg>
                  </div>

                  {/* "×2" proportionality label beside V arrow */}
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: theme.colors.grayMuted,
                      opacity: vBadgeOpacity,
                      lineHeight: 1,
                    }}
                  >
                    ×2
                  </div>
                </div>
              </div>

              {/* 6px Horizontal Bar (ink #1F2933) */}
              <div
                style={{
                  width: 100,
                  height: 6,
                  backgroundColor: theme.colors.ink,
                  borderRadius: 3,
                  margin: "8px 0",
                  opacity: fadeR.opacity,
                  transform: `translateY(${fadeR.translateY}px)`,
                }}
              />

              {/* Denominator: R with amber underline, arrow, and ×2 label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  width: "100%",
                }}
              >
                {/* Letter R with 4px underline */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: fadeR.opacity,
                    transform: `translateY(${fadeR.translateY}px)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 120,
                      fontWeight: 800,
                      lineHeight: 1,
                      color: rColor,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    R
                  </span>

                  {/* 4px Amber Underline under R */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: theme.colors.amber,
                      borderRadius: 2,
                      opacity: rAmberProgress,
                    }}
                  />
                </div>

                {/* Resistance Arrow + Proportionality Badge beside R */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% + 46px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Amber Up Triangle beside R */}
                  <div
                    style={{
                      opacity: arrowROpacity,
                      transform: `translateY(${arrowRTranslateY}px)`,
                    }}
                  >
                    <svg width={18} height={20} viewBox="0 0 18 20" style={{ display: "block" }}>
                      <polygon points="9,2 17,18 1,18" fill={theme.colors.amber} />
                    </svg>
                  </div>

                  {/* "×2" proportionality label beside R arrow */}
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: theme.colors.grayMuted,
                      opacity: rBadgeOpacity,
                      lineHeight: 1,
                    }}
                  >
                    ×2
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. NUMERIC LINE (72px, weight 600, same stacked fraction layout) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: fadeNumeric.opacity,
              transform: `translateY(${fadeNumeric.translateY}px)`,
              marginTop: 20,
            }}
          >
            {/* Left: 3 A = */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  color: theme.colors.green,
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum"',
                  lineHeight: 1,
                  minWidth: 50,
                  textAlign: "right",
                }}
              >
                {formattedCurrent}
              </span>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: theme.colors.grayMuted,
                  lineHeight: 1,
                }}
              >
                A
              </span>
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  color: theme.colors.ink,
                  lineHeight: 1,
                  marginLeft: 8,
                }}
              >
                =
              </span>
            </div>

            {/* Stacked Numeric Fraction: 12 V over 4 Ω */}
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Numerator: 12 V */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 600,
                    color: vNumColor,
                    fontVariantNumeric: "tabular-nums",
                    fontFeatureSettings: '"tnum"',
                    minWidth: 84,
                    textAlign: "right",
                  }}
                >
                  {Math.round(state.voltage)}
                </span>
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 600,
                    color: vUnitColor,
                  }}
                >
                  V
                </span>
              </div>

              {/* 4px Horizontal Bar */}
              <div
                style={{
                  width: 120,
                  height: 4,
                  backgroundColor: theme.colors.ink,
                  borderRadius: 2,
                  margin: "8px 0",
                }}
              />

              {/* Denominator: 4 Ω */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 600,
                    color: rNumColor,
                    fontVariantNumeric: "tabular-nums",
                    fontFeatureSettings: '"tnum"',
                    minWidth: 50,
                    textAlign: "right",
                  }}
                >
                  {Math.round(state.resistance)}
                </span>
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 600,
                    color: rUnitColor,
                  }}
                >
                  Ω
                </span>
              </div>
            </div>
          </div>

          {/* 2b. SECTION HINT (36px gray under numeric line, fixed height container so zero layout shift) */}
          <div
            style={{
              height: 38,
              marginTop: 10,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Voltage section hint (frames 880-925): "Bigger top, bigger answer." */}
            {frame >= 870 && frame <= 930 && (
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: theme.colors.grayMuted,
                  opacity: vHintOpacity,
                  lineHeight: 1,
                }}
              >
                Bigger top, bigger answer.
              </div>
            )}

            {/* Resistance section hint (frames 995-1050): "Bigger bottom, smaller answer." */}
            {frame >= 995 && frame <= 1050 && (
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: theme.colors.grayMuted,
                  opacity: rHintOpacity,
                  lineHeight: 1,
                }}
              >
                Bigger bottom, smaller answer.
              </div>
            )}
          </div>

          {/* 3. PLAIN-LANGUAGE LINE (40px, weight 600, gray: "Current = push ÷ opposition") */}
          <div
            style={{
              opacity: fadePlain.opacity,
              transform: `translateY(${fadePlain.translateY}px)`,
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.2,
              color: theme.colors.grayMuted,
              marginTop: 12,
            }}
          >
            Current ={" "}
            <span style={{ color: pushColor, fontWeight: 700 }}>
              push
            </span>{" "}
            ÷{" "}
            <span style={{ color: oppositionColor, fontWeight: 700 }}>
              opposition
            </span>
          </div>

          {/* 4. CURRENT BAR (24px-high rounded bar, 0-6 A faint track, current value to right) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 20,
              opacity: barProgress > 0 ? 1 : 0,
            }}
          >
            {/* 0-6 A Faint Gray Track with active green bar */}
            <div
              style={{
                position: "relative",
                width: 600,
                height: 24,
                backgroundColor: theme.colors.grayBorder,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Dynamic Green Bar (width = current * 100px) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: activeBarWidth,
                  backgroundColor: theme.colors.green,
                  borderRadius: 12,
                }}
              />
            </div>

            {/* Current Value Readout to the right of the bar */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: theme.colors.green,
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum"',
                minWidth: 80,
              }}
            >
              {formattedCurrent} A
            </div>
          </div>

          {/* 5. VOLTAGE EFFECT CAPTION (Frames 860-930, lower-left, 56px weight 800) */}
          {vCaptionVisible && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                fontFamily: theme.typography.fontFamily,
                pointerEvents: "none",
              }}
            >
              {/* Line 1: More push, (amber #F2A93B) */}
              <div
                style={{
                  opacity: vLine1Opacity,
                  transform: `translateY(${vLine1TranslateY}px)`,
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.amber,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                More push,
              </div>

              {/* Line 2: more current. (green #00A86B) */}
              <div
                style={{
                  opacity: vLine2Opacity,
                  transform: `translateY(${vLine2TranslateY}px)`,
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.green,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                more current.
              </div>
            </div>
          )}

          {/* 6. RESISTANCE EFFECT CAPTION (Frames 980-1050, lower-left, 56px weight 800) */}
          {rCaptionVisible && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                fontFamily: theme.typography.fontFamily,
                pointerEvents: "none",
              }}
            >
              {/* Line 1: More opposition, (amber #F2A93B) */}
              <div
                style={{
                  opacity: rLine1Opacity,
                  transform: `translateY(${rLine1TranslateY}px)`,
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.amber,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                More opposition,
              </div>

              {/* Line 2: less current. (green #00A86B) */}
              <div
                style={{
                  opacity: rLine2Opacity,
                  transform: `translateY(${rLine2TranslateY}px)`,
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.green,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                less current.
              </div>
            </div>
          )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUMMARY SECTION (Frames 1065-1170)                                       */}
          {/* ========================================================================= */}
          {frame >= 1065 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                boxSizing: "border-box",
                zIndex: 10,
              }}
            >
              {/* Row 1 (Frame 1075): "Voltage" (amber) + amber up triangle + "→" + "Current" (green) + green up triangle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: row1Opacity,
                  transform: `translateY(${row1TranslateY}px)`,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: theme.colors.amber,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Voltage
                </span>

                {/* Amber Up Triangle */}
                <div style={{ margin: "0 22px 0 14px", display: "flex", alignItems: "center" }}>
                  <svg width={22} height={26} viewBox="0 0 18 20" style={{ display: "block" }}>
                    <polygon points="9,2 17,18 1,18" fill={theme.colors.amber} />
                  </svg>
                </div>

                {/* Arrow → */}
                <div style={{ marginRight: 22, display: "flex", alignItems: "center" }}>
                  <svg width={48} height={26} viewBox="0 0 48 24" style={{ display: "block" }}>
                    <line
                      x1={4}
                      y1={12}
                      x2={40}
                      y2={12}
                      stroke={theme.colors.ink}
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <polygon points="34,4 46,12 34,20" fill={theme.colors.ink} />
                  </svg>
                </div>

                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: theme.colors.green,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Current
                </span>

                {/* Green Up Triangle */}
                <div style={{ marginLeft: 14, display: "flex", alignItems: "center" }}>
                  <svg width={22} height={26} viewBox="0 0 18 20" style={{ display: "block" }}>
                    <polygon points="9,2 17,18 1,18" fill={theme.colors.green} />
                  </svg>
                </div>
              </div>

              {/* Row 2 (Frame 1085): "Resistance" (ink) + amber up triangle + "→" + "Current" (green) + green down triangle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 40,
                  opacity: row2Opacity,
                  transform: `translateY(${row2TranslateY}px)`,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: theme.colors.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Resistance
                </span>

                {/* Amber Up Triangle */}
                <div style={{ margin: "0 22px 0 14px", display: "flex", alignItems: "center" }}>
                  <svg width={22} height={26} viewBox="0 0 18 20" style={{ display: "block" }}>
                    <polygon points="9,2 17,18 1,18" fill={theme.colors.amber} />
                  </svg>
                </div>

                {/* Arrow → */}
                <div style={{ marginRight: 22, display: "flex", alignItems: "center" }}>
                  <svg width={48} height={26} viewBox="0 0 48 24" style={{ display: "block" }}>
                    <line
                      x1={4}
                      y1={12}
                      x2={40}
                      y2={12}
                      stroke={theme.colors.ink}
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <polygon points="34,4 46,12 34,20" fill={theme.colors.ink} />
                  </svg>
                </div>

                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: theme.colors.green,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Current
                </span>

                {/* Green Down Triangle */}
                <div style={{ marginLeft: 14, display: "flex", alignItems: "center" }}>
                  <svg width={22} height={26} viewBox="0 0 18 20" style={{ display: "block" }}>
                    <polygon points="9,18 17,2 1,2" fill={theme.colors.green} />
                  </svg>
                </div>
              </div>

              {/* Rearranged Rule Line (Frame 1115): 40px gray line */}
              <div
                style={{
                  marginTop: 48,
                  fontSize: 40,
                  fontWeight: 600,
                  color: theme.colors.grayMuted,
                  opacity: rearrangedLineOpacity,
                  transform: `translateY(${rearrangedLineTranslateY}px)`,
                  lineHeight: 1.2,
                }}
              >
                The same rule, rearranged:
              </div>

              {/* Hero Equation (Frame 1125): 96px weight 800 "V = I × R" with V amber, I green, R ink */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 96,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  opacity: heroEqOpacity,
                  transform: `translateY(${heroEqTranslateY}px)`,
                }}
              >
                <span style={{ color: theme.colors.amber }}>V</span>
                <span style={{ color: theme.colors.ink, margin: "0 18px", display: "inline-block", transform: "translateY(-4px)" }}>=</span>
                <span style={{ color: theme.colors.green }}>I</span>
                <span style={{ color: theme.colors.ink, margin: "0 18px", display: "inline-block", transform: "translateY(-4px)" }}>×</span>
                <span style={{ color: theme.colors.ink }}>R</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 8: THIN 2PX GRAY DIVIDER                                           */}
        {/* ========================================================================= */}
        <div
          style={{
            position: "absolute",
            top: 40,
            bottom: 40,
            left: dividerX - 1,
            width: 2,
            backgroundColor: theme.colors.grayBorder,
          }}
        />

        {/* ========================================================================= */}
        {/* RIGHT: OLD READOUT PANEL (Fades out over frames 750-775)                  */}
        {/* ========================================================================= */}
        {oldPanelOpacity > 0 && (
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
              opacity: oldPanelOpacity,
              pointerEvents: "none",
            }}
          >
            <ValueReadout
              label="Voltage"
              value={state.voltage}
              unit="V"
              highlighted={state.highlight === "voltage"}
              formatType="integer"
            />
            <ValueReadout
              label="Current"
              value={state.current}
              unit="A"
              highlighted={false}
              formatType="current"
            />
            <ValueReadout
              label="Resistance"
              value={state.resistance}
              unit="Ω"
              highlighted={state.highlight === "resistance"}
              formatType="integer"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* LIVE CIRCUIT: Glides from left to right (750-780), half-scale in Col 9-12 */}
        {/* ========================================================================= */}
        <div
          style={{
            position: "absolute",
            left: circuitX,
            top: circuitY,
            transform: `translate(-50%, -50%) scale(${circuitScale})`,
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        >
          <Circuit
            animateEntrance={false}
            showCurrentFlow={true}
            showCallouts={false}
            highlightedComponent={state.highlight}
            resistorStrokeWidth={resistorStrokeWidth}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
