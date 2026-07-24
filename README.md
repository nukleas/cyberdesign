# cyberdesign monorepo

![CI](https://github.com/nukleas/cyberdesign/actions/workflows/ci.yml/badge.svg)

A cyber/terminal design system — neon glow, CRT scanlines, augmented clip-path panels, five accent
themes. Used across our other projects, and built to be a good citizen as a standalone dependency
too.

**[Live site](https://nukleas.github.io/cyberdesign/)** ·
**[Storybook](https://nukleas.github.io/cyberdesign/storybook/)** ·
**[Demo](https://nukleas.github.io/cyberdesign/demo/)** ·
**[Examples](https://nukleas.github.io/cyberdesign/examples/)**

| Package | Path | Publish name | What it is |
| --- | --- | --- | --- |
| CSS core | [`packages/cyberdesign`](./packages/cyberdesign) | [`@nukleas/cyberdesign`](https://www.npmjs.com/package/@nukleas/cyberdesign) | Tokens, CSS (`cd-*`), thin React class bindings |
| React + Storybook | [`packages/react-cyberdesign`](./packages/react-cyberdesign) | [`@nukleas/react-cyberdesign`](https://www.npmjs.com/package/@nukleas/react-cyberdesign) | Full React API, semantic props, Storybook |

## Setup

```bash
pnpm install
pnpm build          # CSS first, then React (styles copied into react dist)
```

## Commands

| Command | Description |
| --- | --- |
| `pnpm build` | Build both packages |
| `pnpm build:css` | Build CSS tokens + bundle only |
| `pnpm build:react` | Build React library (needs CSS dist) |
| `pnpm dev` | Watch-rebuild CSS |
| `pnpm storybook` | Storybook for React components → http://localhost:6006 |
| `pnpm demo` | Static CSS harness → serve `packages/cyberdesign` on :4980 |
| `pnpm typecheck` | Typecheck React package |

### Storybook

```bash
pnpm build:css      # once (or after CSS changes)
pnpm storybook      # http://localhost:6006
```

### CSS visual harness

```bash
pnpm build:css
pnpm demo
# open http://localhost:4980/test/
```

### CI

Every push/PR builds both packages, typechecks, and builds Storybook (`.github/workflows/ci.yml`). A `.github/workflows/pages.yml` workflow builds and deploys the [live site](https://nukleas.github.io/cyberdesign/) (landing page, Storybook, demo, and examples) to GitHub Pages on every push to `master`. If you'd rather preview a specific commit without waiting on a deploy, download the `storybook-static` artifact from that CI run in the Actions tab and open its `index.html` locally. A `package-dist` artifact with both packages' built output is attached the same way.

## Consuming

```bash
pnpm add @nukleas/cyberdesign @nukleas/react-cyberdesign
```

Working on this monorepo itself, or want a live local link instead of the published version?

```json
"@nukleas/cyberdesign": "file:../cyberdesign/packages/cyberdesign",
"@nukleas/react-cyberdesign": "file:../cyberdesign/packages/react-cyberdesign"
```

### CSS only

```css
@import "@nukleas/cyberdesign/css";
```

```html
<html class="theme-orange">
```

### React components

```tsx
import { ThemeProvider, Button, GlowCard } from '@nukleas/react-cyberdesign';
import '@nukleas/react-cyberdesign/styles.css';

export function App() {
  return (
    <ThemeProvider theme="cyan">
      <GlowCard>
        <Button variant="primary">Run</Button>
      </GlowCard>
    </ThemeProvider>
  );
}
```

## Workspace layout

```
packages/
  cyberdesign/           # CSS source of truth (tokens → dist/*.css)
  react-cyberdesign/     # React bindings + Storybook over cyberdesign CSS
```

Visual styles always live in `cyberdesign`. React only maps props → `cd-*` classes.
