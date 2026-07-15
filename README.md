# cyberdesign monorepo

![CI](https://github.com/nukleas/cyberdesign/actions/workflows/ci.yml/badge.svg)

Unified cyber/terminal design system for [ocint](https://ocint.app) and [robostrudel](../robostrudel).

| Package | Path | Publish name | What it is |
| --- | --- | --- | --- |
| CSS core | [`packages/cyberdesign`](./packages/cyberdesign) | `cyberdesign` | Tokens, CSS (`cd-*`), thin React class bindings |
| React + Storybook | [`packages/react-cyberdesign`](./packages/react-cyberdesign) | `react-cyberdesign` | Full React API, semantic props, Storybook |

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

Every push/PR builds both packages, typechecks, and builds Storybook (`.github/workflows/ci.yml`). The repo is private, so there's no hosted preview — instead, download the `storybook-static` artifact from the workflow run in the Actions tab and open its `index.html` locally to preview without running the build yourself. A `package-dist` artifact with both packages' built output is attached the same way.

## Consuming

### CSS only

```bash
pnpm add cyberdesign
# or local: "cyberdesign": "workspace:*" / "file:../cyberdesign/packages/cyberdesign"
```

```css
@import "cyberdesign/css";
```

```html
<html class="theme-orange">
```

### React components

```bash
pnpm add react-cyberdesign
```

```tsx
import { ThemeProvider, Button, GlowCard } from 'react-cyberdesign';
import 'react-cyberdesign/styles.css';

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
