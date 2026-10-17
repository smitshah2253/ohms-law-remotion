import { getLength, getPointAtLength } from "@remotion/paths";
import { theme } from "../../theme";

/**
 * Geometric specifications for the balanced rectangular circuit loop.
 * - Circuit Stage: Columns 1-7 (970px width)
 * - Canvas: 900 x 560
 * - Left side: Battery centered at Y = 280, with equal 148px gaps above/below.
 * - Top side: Resistor centered at X = 450, with equal 208px gaps on both sides.
 */
export const circuitGeometry = {
  // Bounding rect coordinates
  left: 150,
  right: 750,
  top: 80,
  bottom: 480,
  radius: theme.radius, // 12px

  // Component centers and spans
  battery: {
    centerX: 150,
    centerY: 280,
    topTerminalY: 240,    // Gap above: 240 - (80 + 12) = 148px
    bottomTerminalY: 320, // Gap below: (480 - 12) - 320 = 148px
  },
  resistor: {
    centerX: 450,
    centerY: 80,
    leftTerminalX: 370,   // Gap left: 370 - (150 + 12) = 208px
    rightTerminalX: 530,  // Gap right: (750 - 12) - 530 = 208px
    peaks: 6,
    amplitude: 22,
  },
} as const;

const { left, right, top, bottom, radius, battery, resistor } = circuitGeometry;

/**
 * Full continuous closed-loop path string.
 * Usable with @remotion/paths for path length and point-at-length calculations.
 */
export const fullLoopPath = [
  `M ${left + radius} ${top}`,
  `H ${right - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
  `V ${bottom - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
  `H ${left + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
  `V ${top + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
  `Z`,
].join(" ");

/**
 * Conventional Current Loop Path: Starts at Battery positive terminal (150, 240),
 * travels UP to top-left corner, RIGHT along top wire, DOWN along right wire,
 * LEFT along bottom wire, and UP to Battery negative terminal (150, 320) and back.
 */
export const conventionalLoopPath = [
  `M ${left} ${battery.topTerminalY}`,
  `V ${top + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
  `H ${right - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
  `V ${bottom - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
  `H ${left + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
  `V ${battery.topTerminalY}`,
  `Z`,
].join(" ");

export const conventionalLoopLength = getLength(conventionalLoopPath);

/**
 * Top Wire Segment: From Battery positive terminal (Y=240) up through top-left corner
 * to the Resistor left terminal (X=370).
 */
export const topWirePath = [
  `M ${left} ${battery.topTerminalY}`,
  `V ${top + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
  `H ${resistor.leftTerminalX}`,
].join(" ");

/**
 * Resistor Zigzag Path: 6 peaks (3 up, 3 down) centered at Y=80.
 * Left terminal at X=370, Right terminal at X=530 (160px span).
 */
export const resistorPath = [
  `M ${resistor.leftTerminalX} ${top}`,
  `L 380 ${top}`,
  `L 392.5 ${top - resistor.amplitude}`, // Peak 1 (up)
  `L 417.5 ${top + resistor.amplitude}`, // Peak 2 (down)
  `L 442.5 ${top - resistor.amplitude}`, // Peak 3 (up)
  `L 467.5 ${top + resistor.amplitude}`, // Peak 4 (down)
  `L 492.5 ${top - resistor.amplitude}`, // Peak 5 (up)
  `L 517.5 ${top + resistor.amplitude}`, // Peak 6 (down)
  `L 520 ${top}`,
  `L ${resistor.rightTerminalX} ${top}`,
].join(" ");

/**
 * Return Wire Segment: From Resistor right terminal (X=530), through top-right corner,
 * down right wire, through bottom-right corner, along bottom wire, through bottom-left corner,
 * and up to Battery negative terminal (Y=320).
 */
export const returnWirePath = [
  `M ${resistor.rightTerminalX} ${top}`,
  `H ${right - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
  `V ${bottom - radius}`,
  `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
  `H ${left + radius}`,
  `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
  `V ${battery.bottomTerminalY}`,
].join(" ");

// Precompute exact lengths via @remotion/paths
export const fullLoopLength = getLength(fullLoopPath);
export const topWireLength = getLength(topWirePath);
export const resistorLength = getLength(resistorPath);
export const returnWireLength = getLength(returnWirePath);

export { getLength, getPointAtLength };
