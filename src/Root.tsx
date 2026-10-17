import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { timing } from "./timing";
import { theme } from "./theme";

export const Root: React.FC = () => {
  return (
    <Composition
      id="OhmsLawExplainer"
      component={Main}
      durationInFrames={timing.totalFrames}
      fps={timing.fps}
      width={theme.layout.width}
      height={theme.layout.height}
      defaultProps={{
        showGrid: false,
      }}
    />
  );
};
