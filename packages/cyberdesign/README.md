# cyberdesign

Unified cyber/terminal design system — shared design tokens, glow utilities, CRT effects, and component primitives (`cd-*` classes).

Part of the [cyberdesign monorepo](../../README.md). For the full React API and Storybook, see [`react-cyberdesign`](../react-cyberdesign).

## Install

```bash
pnpm add cyberdesign
```

```css
@import "cyberdesign/css";
```

```html
<html class="theme-orange">  <!-- or theme-cyan | theme-green | theme-red | theme-steel -->
```

## Build

From monorepo root:

```bash
pnpm build:css
pnpm demo   # http://localhost:4980/test/
```

## Exports

| Import | Contents |
| --- | --- |
| `cyberdesign` / `cyberdesign/css` | Full CSS bundle |
| `cyberdesign/vars` | CSS variables only |
| `cyberdesign/tailwind` | Variables + Tailwind v4 `@theme` |
| `cyberdesign/react` | Thin React class wrappers (prefer `react-cyberdesign` for apps) |
| `cyberdesign/tokens` | TypeScript token constants |
