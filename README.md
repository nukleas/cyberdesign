# cyberdesign

Unified cyber/terminal design system. Provides shared design tokens, glow utilities, CRT effects, and 28 component primitives in a dark cyberpunk aesthetic with dual-theme support (orange and cyan accents). Used by [ocint](../ocint) and [robostrudel](../robostrudel).

## Outputs

| Import path | File | Contents |
|---|---|---|
| `cyberdesign` or `cyberdesign/css` | `dist/cyberdesign.css` | Full bundle — variables + base + utilities + all components |
| `cyberdesign/vars` | `dist/cyberdesign-vars-only.css` | CSS variables only (`:root`, `.theme-orange`, `.theme-cyan`) |
| `cyberdesign/tailwind` | `dist/tailwind-theme.css` | Variables + `@theme inline` block for Tailwind v4 |
| `cyberdesign/react` | `src/react/index.ts` | React components (GlowCard) |
| `cyberdesign/tokens` | `src/tokens/index.ts` | TypeScript token constants |

## Quick start

Add as a local dependency:

```json
"cyberdesign": "file:../cyberdesign"
```

Then run `npm install` and import:

```css
@import "cyberdesign/dist/cyberdesign.css";
```

Add the theme class to `<html>`:

```html
<html class="theme-orange">   <!-- or theme-cyan -->
```

## Consuming in ocint (Tailwind v4)

```css
/* globals.css */
@import "cyberdesign/dist/tailwind-theme.css";
@import "cyberdesign/dist/cyberdesign.css";
```

```tsx
// app/layout.tsx
<html lang="en" className="theme-orange">
```

## Consuming in robostrudel (vanilla CSS)

```html
<link rel="stylesheet" href="../cyberdesign/dist/cyberdesign.css">
<html class="theme-cyan">
```

Optionally alias to legacy var names in your own CSS:

```css
:root { --neon: var(--cd-accent); }
```

## Build

```bash
npm run build    # generate dist/
npm run dev      # watch mode
```

Preview the component demo:

```bash
npx serve . -p 4980
# open http://localhost:4980/test/
```

## Token architecture

```
src/tokens/base.ts       raw hex palette (backgrounds, text, color families)
src/tokens/semantic.ts   purpose-mapped --cd-* tokens (bg, text, accent, glow…)
src/tokens/themes/       orange.ts + cyan.ts accent-family overrides
        │
        └─▶ build.ts ──▶ dist/cyberdesign.css
                    └──▶ dist/cyberdesign-vars-only.css
                    └──▶ dist/tailwind-theme.css
```

The semantic token `--cd-accent` resolves to orange or cyan depending on which theme class is on `<html>`.

## Components

**Form & input**
`cd-input` · `cd-textarea` · `cd-input-group` · `cd-input-addon` · `cd-select` · `cd-checkbox` · `cd-radio` · `cd-switch` · `cd-slider` · `cd-form-label` · `cd-field` · `cd-tooltip` · `cd-progress`

**Display primitives**
`cd-badge` · `cd-btn` · `cd-glow-card` · `cd-panel-header`

**Data & layout**
`cd-table` · `cd-tabs` · `cd-alert` · `cd-skeleton` · `cd-kbd` · `cd-avatar` · `cd-breadcrumb` · `cd-spinner`

**Overlay & navigation**
`cd-modal` · `cd-toast` · `cd-accordion` · `cd-pagination` · `cd-dropdown`

**Charts & data viz**
`cd-stat` · `cd-hbar-chart` · `cd-histogram` · `cd-sparkline` · `cd-activity-grid` · `cd-timeline` · canvas shells (`src/js/charts.js`)

**Decorative**
`cd-clip-*` · `cd-step-*` · `cd-aug-panel` · `cd-aug-btn` · `cd-corners` · `cd-vectorbg`

**Utilities** (`utilities.css`)
`.cd-glow-*` · `.cd-text-glow` · `.cd-scanlines` · `.cd-pixel-grid` · `.cd-glass` · `.cd-label` · `.cd-glitch`
