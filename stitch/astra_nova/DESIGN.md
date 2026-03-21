# Design System Specification: Orbital Precision & Ethereal Depth

## 1. Overview & Creative North Star: "The Celestial Architect"

This design system moves beyond the rigid, boxy constraints of traditional SaaS platforms to embrace a "Celestial Architect" aesthetic. It is defined by expansive breathing room, weightless layers, and a sophisticated interplay of light and shadow that mirrors the vastness of the space industry.

Instead of a standard grid of static boxes, the UI is treated as a series of **coordinated orbits**. We break the "template" look through intentional asymmetry—using large-scale typography offset against focused, high-density data clusters. Overlapping elements and "frosted" glass surfaces create a sense of mechanical precision blended with futuristic elegance. This is not just a dashboard; it is a high-tech viewport into the future of aerospace matchmaking.

---

## 2. Colors & Surface Logic

The palette is anchored by a vibrant, deep blue that signifies authority and technological advancement, supported by a sophisticated range of neutral surfaces.

### The "No-Line" Rule
To maintain a premium, high-end feel, **1px solid borders are prohibited for sectioning.** Physical boundaries must be defined exclusively through background color shifts or tonal transitions.
- *Example:* A side navigation panel should be `surface-container-low` (#eef1f3) sitting directly against a `surface` (#f5f7f9) main content area.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
- **Base Layer:** `surface` (#f5f7f9) - The infinite void.
- **Sectioning:** `surface-container-low` (#eef1f3) - Defining large functional regions.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) - High-priority data "floating" on the section layer.
- **High Importance:** `surface-container-highest` (#d9dde0) - Sub-navigation or inactive utility panels.

### The "Glass & Gradient" Rule
Standard flat colors lack "soul." 
- **Glassmorphism:** For floating overlays (modals, dropdowns, or hovering tooltips), use a semi-transparent `surface-container-lowest` with a `backdrop-blur` of 20px. 
- **Signature Textures:** Main CTAs must utilize a subtle linear gradient from `primary` (#0052d0) to `primary-container` (#799dff) at a 135-degree angle to simulate the curve of a planetary horizon.

---

## 3. Typography: The Editorial Scale

We utilize a dual-font strategy to balance high-tech precision with human readability.

*   **Display & Headlines (`Space Grotesk`):** Used for "Hero" moments and section headers. Its geometric quirks provide a futuristic, aerospace-engineering vibe. 
    *   *Scale:* `display-lg` (3.5rem) to `headline-sm` (1.5rem).
*   **Interface & Body (`Inter`):** The workhorse for data, labels, and long-form text. It provides maximum legibility at small scales.
    *   *Scale:* `title-lg` (1.375rem) down to `label-sm` (0.6875rem).

**Editorial Intent:** Use high contrast in scale. A `display-md` headline should often be paired with a `label-md` uppercase sub-header (with 0.1rem letter spacing) to create an authoritative, "spec-sheet" aesthetic.

---

## 4. Elevation & Depth

Hierarchy is achieved through **Tonal Layering** rather than structural lines.

### The Layering Principle
Depth is organic. Place a `surface-container-lowest` card on a `surface-container-low` background to create a "lift" that feels integrated into the environment.

### Ambient Shadows
When an element must "float" (e.g., a primary action button or a modal):
- **Blur:** Large and diffused (e.g., 24px - 40px).
- **Opacity:** 4% to 8%.
- **Tint:** The shadow color must be a tinted version of `on-surface` (#2c2f31) or `primary` (#0052d0) to mimic ambient light bouncing off the surface.

### The "Ghost Border" Fallback
If an element lacks sufficient contrast (e.g., a white card on a white background), use a **Ghost Border**: `outline-variant` (#abadaf) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary-container`), `xl` roundedness (0.75rem). Use `primary-dim` for hover states.
- **Secondary:** `surface-container-lowest` with a "Ghost Border."
- **Tertiary:** No background, `primary` text, `label-md` weight.

### Cards & Lists
**Forbid the use of divider lines.** 
- Separate list items using vertical whitespace (Spacing Scale `3` or `4`).
- For complex lists, use alternating background tints: Item 1 on `surface`, Item 2 on `surface-container-low`.

### Matchmaking Chips
- **Status Chips:** Use `secondary-container` (#d6e5ef) for "Pending" and `tertiary-container` (#f797f0) for "AI-Matched."
- **Shape:** Use `full` roundedness (9999px) for a capsule look that feels accessible and friendly.

### Input Fields
- **Default State:** `surface-container-low` background, no border, `md` roundedness.
- **Focus State:** `surface-container-lowest` background with a `primary` ghost border (20% opacity) and a soft ambient shadow.

### Orbital Nav (Custom Component)
A vertical side navigation using `glassmorphism`. The "Active" state is indicated by a vertical `primary` bar (4px wide) on the far right of the nav item, creating a "docked" visual effect.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use negative space as a functional tool. If a section feels crowded, increase padding to Spacing Scale `8` (2.75rem).
- **Do** use `tertiary` (#8d3a8b) accents sparingly for AI-driven insights to distinguish them from manual platform features.
- **Do** lean into the `xl` roundedness (0.75rem) for main containers to soften the high-tech aesthetic.

### Don’t:
- **Don’t** use pure black (#000000) for text. Use `on-surface` (#2c2f31) to maintain a soft, premium feel.
- **Don’t** use standard "drop shadows" with 0 blur and high opacity. It breaks the "Celestial" metaphor.
- **Don’t** use 1px dividers between table rows. Use spacing and subtle tonal shifts to guide the eye.
- **Don’t** clutter the "Orbital" viewport. If information isn't vital, hide it behind a glassmorphic "More Info" hover state.