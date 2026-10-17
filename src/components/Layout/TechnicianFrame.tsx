import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../theme";

interface TechnicianFrameProps {
  children?: React.ReactNode;
}

/**
 * Standard technical HUD layout for  training visuals.
 * Provides consistent 120px margins, header, and clean technician breadcrumbs.
 */
export const TechnicianFrame: React.FC<TechnicianFrameProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const totalFrames = theme.composition.durationInFrames;
  const progressRatio = Math.min(1, Math.max(0, frame / totalFrames));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.ink,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: theme.layout.outerMarginX,
          right: theme.layout.outerMarginX,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${theme.colors.grayBorder}`,
          paddingBottom: theme.layout.spacingUnit * 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              ...theme.typography.labelSmall,
              color: theme.colors.ink,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            Smit Shah
          </span>
          <span
            style={{
              ...theme.typography.labelSmall,
              color: theme.colors.grayMuted,
            }}
          >
            / FIELD ROBOTICS TECH / MODULE 01: OHM&apos;S LAW
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              ...theme.typography.labelSmall,
              color: theme.colors.grayMuted,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            FRAME {String(frame).padStart(3, "0")} / {totalFrames}
          </span>
        </div>
      </div>

      {/* Main Content Area constrained within 120px outer margin */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: theme.layout.outerMarginX,
          width: theme.layout.contentWidth,
          height: 850,
        }}
      >
        {children}
      </div>

      {/* Bottom Timeline Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: theme.layout.outerMarginX,
          width: theme.layout.contentWidth,
          height: 2,
          backgroundColor: theme.colors.grayBorder,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressRatio * 100}%`,
            backgroundColor: theme.colors.grayMuted,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
