# ⚡ Ohm's Law Explainer – Remotion 2D Motion Graphics

A high-precision, programmatic 2D technical explainer video illustrating **Ohm's Law ($I = \frac{V}{R}$)** for robotics and electrical field technicians. Built entirely with code using **[Remotion](https://www.remotion.dev/)**, **React**, and **TypeScript**.

---

## 🎯 Overview

- **Resolution**: 1920 × 1080 (Full HD)
- **Frame Rate**: 30 FPS
- **Duration**: 1,170 frames (~39 seconds)
- **Aesthetic**: Swiss technical design, 12-column layout grid, high-contrast dark-mode studio canvas, custom typography (*Manrope*).

---

## 📽️ Scene Breakdown

| Scene | Frames | Title | Visual Highlights |
| :--- | :--- | :--- | :--- |
| **Scene 1** | `0 – 120` | **The Hook** | Staggered typographic entrance: *"What decides how much current flows?"* |
| **Scene 2** | `110 – 340` | **The Circuit** | Self-drawing vector schematic (Battery, Resistor, Wires), charge dot flow initialization, and 3 synchronized callout tags. |
| **Scene 3** | `330 – 550` | **Voltage Dynamics** | Doubling voltage ($12\text{ V} \to 24\text{ V}$) doubles current ($3\text{ A} \to 6\text{ A}$); charge flow velocity doubles in real-time. |
| **Scene 4** | `540 – 750` | **Resistance Dynamics** | Doubling resistance ($4\ \Omega \to 8\ \Omega$) halves current ($3\text{ A} \to 1.5\text{ A}$); dynamic stroke narrowing on the resistor symbol. |
| **Scene 5** | `750 – 1170` | **The Law & Takeaway** | Smooth circuit transition to right column, hero formula display ($I = \frac{V}{R}$), live dynamic calculation, and technician summary. |

---

## 🚀 Key Technical Features

- **Phase-Integral Flow Animation**: Current flow dots are calculated using a closed-form phase integral (`Phase(t) = ∫ flowSpeed(τ) dτ`), ensuring 100% smooth, continuous motion without jumping or glitching across speed changes.
- **Deterministic State Machine**: Every visual property across all 1,170 frames is driven deterministically by `getState(frame)`.
- **Pure Vector SVG Schematic**: Hand-coded SVG paths with stroke-dashoffset draw-in transitions and clean industrial iconography.
- **Seamless Cross-Dissolve Transitions**: Inter-scene transitions with overlapping alpha-blends and spatial continuity.
- **12-Column Technical Grid**: Modular alignment with optional debug grid overlay (`showGrid` prop).

---

## 🛠️ Tech Stack

- **Framework**: [Remotion 4.0](https://www.remotion.dev/)
- **Frontend**: React 18
- **Language**: TypeScript 5
- **Typography**: `@remotion/google-fonts` (Manrope: 500, 600, 800)
- **Path Math**: `@remotion/paths`

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 2. Installation
```bash
git clone https://github.com/smitshah2253/ohms-law-remotion.git
cd ohms-law-remotion
npm install
```

### 3. Open Remotion Studio Preview
To interactively preview, scrub, and inspect the animation in your browser:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### 4. Render to MP4 Video
To render the final high-definition MP4 video:
```bash
npm run build
```
The output file will be generated at `out/ohms-law.mp4`.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Circuit/         # SVG components (Battery, Resistor, Wire, CurrentFlow, Callouts)
│   │   ├── Layout/          # Studio canvas background and technician frame
│   │   ├── Stage/           # Modular 12-column stage and live value readouts
│   │   └── GridOverlay.tsx  # Toggleable alignment grid
│   ├── scenes/
│   │   ├── Scene1Hook.tsx
│   │   ├── Scene2Circuit.tsx
│   │   ├── Scene3Voltage.tsx
│   │   ├── Scene4Resistance.tsx
│   │   └── Scene5Rule.tsx
│   ├── Main.tsx             # Master composition with scene transitions
│   ├── Root.tsx             # Remotion Root & composition definition
│   ├── state.ts             # Deterministic circuit state timeline
│   ├── motion.ts            # Easing functions and animation helpers
│   ├── theme.ts             # Design tokens (colors, typography, grid spacing)
│   └── timing.ts            # Frame timings and duration constants
├── out/                     # Rendered video outputs (git-ignored)
├── LICENSES.md              # Open source license declarations
└── package.json
```

---

## 📄 License
This project code is available for reference and portfolio demonstration. Refer to [LICENSES.md](LICENSES.md) for third-party dependency and typography license details.
