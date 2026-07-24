# cyberdesign

Unified cyber/terminal design system — shared design tokens, glow utilities, CRT effects, and component primitives (`cd-*` classes).

Part of the [cyberdesign monorepo](../../README.md). For the full React API and Storybook, see [`react-cyberdesign`](../react-cyberdesign).

## Install

```bash
pnpm add @nukleas/cyberdesign
```

```css
@import "@nukleas/cyberdesign/css";
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
| `@nukleas/cyberdesign` / `@nukleas/cyberdesign/css` | Full CSS bundle |
| `@nukleas/cyberdesign/vars` | CSS variables only |
| `@nukleas/cyberdesign/tailwind` | Variables + Tailwind v4 `@theme` |
| `@nukleas/cyberdesign/react` | Thin React class wrappers (prefer `@nukleas/react-cyberdesign` for apps) |
| `@nukleas/cyberdesign/tokens` | TypeScript token constants |
