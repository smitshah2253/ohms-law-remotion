import { getState } from "./state";

const testFrames = [0, 300, 420, 600, 700, 760, 880, 1000, 1100];

console.log("================================================================================");
console.log("================================================================================");
console.log(
  [
    "Frame".padEnd(8),
    "Voltage (V)".padEnd(14),
    "Resistance (Ω)".padEnd(16),
    "Current (A)".padEnd(14),
    "FlowSpeed (px/f)".padEnd(18),
    "Highlight".padEnd(12),
  ].join("")
);
console.log("-".repeat(82));

for (const frame of testFrames) {
  const state = getState(frame);
  console.log(
    [
      String(frame).padEnd(8),
      state.voltage.toFixed(2).padEnd(14),
      state.resistance.toFixed(2).padEnd(16),
      state.current.toFixed(2).padEnd(14),
      state.flowSpeed.toFixed(2).padEnd(18),
      state.highlight.padEnd(12),
    ].join("")
  );
}
console.log("================================================================================");
