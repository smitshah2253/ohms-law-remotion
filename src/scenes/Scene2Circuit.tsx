import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage/Stage";
import { Circuit } from "../components/Circuit/Circuit";
import { getState } from "../state";
import { fadeUp } from "../motion";

/**
 * Scene 2: Circuit (Frames 120 - 330)
 * 
 * Rules:
 * - Frames 120-165: Circuit draws in (Prompt 4 order).
 * - Frame 165: Flow starts (dots fade in from the battery over 8 frames).
 * - Frame 185 onward: Three callouts appear one by one, each 30 frames apart:
 *   1. Frame 185: "Voltage (V): the push" at battery + Row 1 (Voltage, 12 V) fades up.
 *   2. Frame 215: "Resistance (R): the opposition" at resistor + Row 3 (Resistance, 4 Ω) fades up.
 *   3. Frame 245: "Current (I): the flow" along wire + Row 2 (Current, 3 A) fades up.
 * - By frame 300: Callouts fade to 40% opacity so they stop competing for attention.
 * - Readout rows show 12 V, 4 Ω, 3 A (from getState).
 * - Zero overlap between callouts, wires, and charge dots.
 */
export const Scene2Circuit: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getState(frame);

  // Synchronized readout row opacities
  // If frame >= 330, rows remain fully visible for subsequent scenes
  const voltageOpacity = frame >= 330 ? 1 : fadeUp(frame, 185).opacity;
  const resistanceOpacity = frame >= 330 ? 1 : fadeUp(frame, 215).opacity;
  const currentOpacity = frame >= 330 ? 1 : fadeUp(frame, 245).opacity;
  const dividerOpacity = frame >= 330 ? 1 : fadeUp(frame, 185).opacity;

  return (
    <Stage
      voltage={state.voltage}
      current={state.current}
      resistance={state.resistance}
      highlight={state.highlight}
      voltageOpacity={voltageOpacity}
      currentOpacity={currentOpacity}
      resistanceOpacity={resistanceOpacity}
      dividerOpacity={dividerOpacity}
    >
      <Circuit
        startFrame={120}
        flowStartFrame={165}
        showCurrentFlow={frame >= 165}
        showCallouts={frame >= 185}
        highlightedComponent={state.highlight}
      />
    </Stage>
  );
};
