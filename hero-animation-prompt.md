# Hero Section — Cinematic Reveal Animation Prompt

Use this as a build prompt for an AI coding agent (or as a creative brief for a developer) to add this entrance animation to a website hero section.

## Goal

A single, one-time, cinematic load-in sequence for a dark tech/engineering-themed hero section. It should feel like a product reveal film compressing into a website: a glowing line draws itself, blooms into a circuit/chip diagram, and resolves into the site's title, tagline, and navigation. Runs once on page load, roughly 3 seconds start to finish, then settles into a quiet ambient loop.

## Visual style

- **Palette:** near-black background (`#05080a` – `#0c1316`), a single glowing teal-cyan accent (`#4DF0E0` – `#57ecd9`) for every lit element, cool gray for dormant/unlit lines (`#1c2a2e`–`#21363d`), off-white for text (`#e8f1f2`).
- **Mood:** clean, minimal, precise — a electronics-lab / PCB-fabrication aesthetic. No warm colors, no gradients beyond the glow itself.
- **Glow treatment:** every "active" line, node, or letter gets a soft drop-shadow/blur in the accent color (`filter: drop-shadow(0 0 Npx accent)`), as if lit from within — not a flat stroke.

## Sequence (in order, with approximate timing)

1. **0.0s – 0.8s — Seed line.**
   A single short glowing horizontal line draws itself into existence at the center of the screen (animate `stroke-dashoffset` from full length to 0, or a `scaleX(0 → 1)` transform). This is the only thing visible at this point — everything else is still black.

2. **0.6s – 1.3s — Circuit bloom.**
   The seed line triggers a branching circuit diagram: multiple right-angled trace paths radiate outward from the center and light up in a staggered cascade (each trace ~60–80ms after the previous), as if current is propagating outward. Small square/circular "nodes" at trace endpoints light up shortly after each trace reaches them. A small chip/IC outline sits at the very center where the traces originate.

3. **1.3s – 2.0s — Title reveal.**
   The page title fades and rises in **one character at a time** (each letter: `opacity 0→1`, `translateY(+28px → 0)`, staggered ~40–50ms per character) — not a single fade on the whole string. This is the focal moment of the sequence.

4. **1.9s – 2.3s — Subtitle.**
   A tracked-out (wide letter-spacing) subtitle line fades up beneath the title as a single block (not per-character).

5. **2.2s – 2.6s — Meta / details row.**
   Small monospace metadata (date, location, event info, etc.) fades up.

6. **2.4s – 2.9s — Call-to-action buttons.**
   Primary and secondary buttons fade up together, slightly after the meta row.

7. **~2.7s — Navigation bar.**
   The top navigation bar slides down from off-screen (`translateY(-100%) → 0`) and fades in — it appears *last*, after the hero content has settled, not before.

8. **~2.9s onward — Ambient loop.**
   Once the entrance finishes, a soft animated waveform/sine-line drifts continuously near the bottom of the hero (slow, low-amplitude, glowing), giving the impression of a live signal — this loops indefinitely and is the only motion left running.

## Interaction & accessibility rules

- The whole sequence plays **once** per page load — it is not scroll-triggered and does not repeat.
- Respect `prefers-reduced-motion`: if set, skip straight to the fully-settled end state (everything visible, no animated draw-in), and stop the ambient waveform loop.
- Everything after the entrance is static/idle except the single ambient waveform — avoid adding extra hover-triggered motion on every element; keep the page calm once the reveal is done.

## Implementation notes

- Circuit traces and nodes: inline SVG, `<path>` elements with `stroke-dasharray`/`stroke-dashoffset` for the draw-in, plus a `.lit` class toggled via JS/`setTimeout` per element to stagger the cascade.
- Title letters: split the string into individual `<span>` elements at render time (JS), animate each with a per-index `animation-delay`.
- Ambient waveform: `<canvas>` with `requestAnimationFrame`, drawing a couple of overlaid `sin()` curves with a soft glow (`shadowBlur`), amplitude tapering toward the edges so it reads as a signal burst rather than a full-width wave.
- Keep all motion timing in cubic-bezier easing close to `(0.16, 0.8, 0.24, 1)` for the rises — a quick decisive start with a soft settle, not a bouncy or linear feel.
