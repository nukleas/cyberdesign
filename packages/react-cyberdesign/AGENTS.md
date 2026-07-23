# react-cyberdesign — agent context

React component library built on **cyberdesign** (workspace package at `../cyberdesign`).
CSS-first design system; this package is the official React API with semantic props and Storybook docs.

**Goal:** a complete, production-ready component set — standard UI primitives plus cyber-only
extras (Terminal, HUD, GlowCard, etc.). Visual styles always live in cyberdesign CSS; React only
maps props.

## Architecture

```
../cyberdesign          tokens + CSS (cd-* classes, --cd-* vars) — source of visual truth
react-cyberdesign/
  src/components/       one file per component (PascalCase = export name)
  src/lib/cn.ts         className join helper
  src/lib/types.ts      CdColor, CdTheme, CdSize
  src/theme/            ThemeProvider, useTheme
  src/styles/index.css  Storybook CSS entry → imports cyberdesign/css
  src/index.ts          public barrel
  .storybook/           Storybook 8 (Vite) + autodocs
```

## Hard rules

1. **Never invent styling.** Only emit `cd-*` classes that exist in cyberdesign
   (`../cyberdesign/src/css/components/*.css`). No inline styles except CSS variable hooks
   the CSS contract already uses (e.g. gauge `--value`).
2. **Semantic props**: `variant`, `size`, `color`, boolean modifiers.
   Map them to BEM modifiers: `cd-btn--primary`, `cd-input--sm`.
3. **Extend native HTML attributes**; always merge `className` and spread `...rest`.
   `Omit` colliding names (`title`, `color`, `size` when types differ).
4. **JSDoc on exported props and components** — Storybook autodocs and consumers read these.
5. **Use `cn` from `../lib/cn`** — do not paste a local class helper.
6. **Shared types** — import `CdColor` / `CdTheme` / `CdSize` from `../lib/types`.
7. **Named function exports**, no `React.FC`. `import type` for types.
8. **Theme required for accents** — previews and apps need `theme-orange` (or another theme)
   on an ancestor. Prefer `ThemeProvider`.

## Adding a component

1. Confirm CSS exists in cyberdesign (`src/css/components/<name>.css` + demo in `test/index.html`).
2. Add `src/components/<Name>.tsx` following Button / Alert / Tabs patterns.
3. Export from `src/index.ts`.
4. Add `src/components/<Name>.stories.tsx` with `tags: ['autodocs']` and `argTypes` categories
   (`Appearance`, `State`, `Content`).
5. `pnpm typecheck` and check Storybook (from monorepo root: `pnpm storybook`).

## Discovering the CSS contract

1. Read `../cyberdesign/src/css/components/<x>.css` for modifiers (`.cd-x--*`) and parts (`.cd-x__*`).
2. Read the matching section in `../cyberdesign/test/index.html` for canonical DOM.
3. Thin wrappers in `../cyberdesign/src/react/` are a useful reference for prop names.

## Commands

From monorepo root:

```bash
pnpm build:css          # regenerate CSS if tokens/components changed
pnpm install
pnpm storybook
pnpm build:react
pnpm typecheck
```

From this package:

```bash
pnpm build
pnpm storybook
pnpm typecheck
```

## Build outputs

| Path | Contents |
| --- | --- |
| `dist/index.js` / `.cjs` | Library bundle |
| `dist/index.d.ts` | Types |
| `dist/styles.css` | Copied full cyberdesign CSS bundle |

Consumers:

```ts
import { Button, ThemeProvider } from 'react-cyberdesign';
import 'react-cyberdesign/styles.css';
```

## Do not

- Hand-edit cyberdesign `dist/` — build it from cyberdesign source.
- Add Tailwind as a hard dependency of this package (cyberdesign CSS is enough).
- Duplicate token definitions; import or reference cyberdesign.
