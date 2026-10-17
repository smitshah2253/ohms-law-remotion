import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

interface GridOverlayProps {
  showGrid?: boolean;
}

/**
 * 12-Column Technical Layout Grid Overlay.
 * 120px outer margins, 24px gutters (3 * 8px spacing units), 12 equal columns.
 */
export const GridOverlay: React.FC<GridOverlayProps> = ({ showGrid = true }) => {
  if (!showGrid) {
    return null;
  }

  const { outerMarginX, columns, gutter, contentWidth } = theme.layout;
  const totalGuttersWidth = (columns - 1) * gutter;
  const columnWidth = (contentWidth - totalGuttersWidth) / columns;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: outerMarginX,
          width: contentWidth,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            style={{
              width: columnWidth,
              height: "100%",
              backgroundColor: "rgba(0, 168, 107, 0.03)", // Very faint green tint
              borderLeft: `1px dashed ${theme.colors.grayBorder}`,
              borderRight: `1px dashed ${theme.colors.grayBorder}`,
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              paddingTop: 16,
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: 10,
                color: theme.colors.grayMuted,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              C{index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Margin boundary guides */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: outerMarginX,
          borderLeft: `1px solid ${theme.colors.amber}`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: outerMarginX,
          borderRight: `1px solid ${theme.colors.amber}`,
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};
