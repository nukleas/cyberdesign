# Contributing to cyberdesign

Thanks for your interest in cyberdesign! This is a pnpm monorepo (`cyberdesign` for CSS/tokens,
`react-cyberdesign` for the React API + Storybook) — contributions of any size (typo fixes, new
components, bug reports) are welcome.

## Setup

```bash
pnpm install
pnpm build      # CSS first, then React (styles get copied into the React package's dist)
```

See [AGENTS.md](./AGENTS.md) for the full command reference, and
[`packages/cyberdesign/CLAUDE.md`](./packages/cyberdesign/CLAUDE.md) /
[`packages/react-cyberdesign/AGENTS.md`](./packages/react-cyberdesign/AGENTS.md) for the
conventions each package follows (class naming, token usage, how to add a component).

## Before opening a PR

```bash
pnpm build
pnpm typecheck
pnpm build-storybook   # catches story/config errors
```

## Scope

cyberdesign is the maximalist cyber/terminal aesthetic: neon glow, CRT scanlines, augmented
clip-path panels, JetBrains Mono, five accent themes (orange/cyan/green/red/steel). New components
should fit that brief — dark-first, high-contrast, unapologetically HUD/terminal in register. All
CSS classes are prefixed `cd-`, all custom properties `--cd-*`; never hardcode a hex value in
component CSS — reference a token instead.

See [ROADMAP.md](./ROADMAP.md) before proposing a new component — it lists what's already under
consideration, so you don't duplicate planning work.

## Reporting issues

Open a GitHub issue with a clear description and, for visual bugs, a screenshot or the Storybook
story that reproduces it. Note which theme (orange/cyan/green/red/steel) and browser you saw it in.

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're
expected to uphold it.
