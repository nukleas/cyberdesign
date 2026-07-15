# cyberdesign monorepo — agent context

pnpm workspace with two publishable packages:

```
packages/
  cyberdesign/           name: cyberdesign          CSS + tokens + thin React wrappers
  react-cyberdesign/     name: react-cyberdesign    Full React API + Storybook
```

Root is private (`cyberdesign-monorepo`). Do not publish the root package.

## Package roles

| Package | Responsibility |
| --- | --- |
| `cyberdesign` | Source of visual truth: tokens, CSS (`cd-*` / `--cd-*`), HTML demo harness |
| `react-cyberdesign` | Official React API: semantic props, ThemeProvider, Storybook docs |

`packages/cyberdesign/src/react/` holds **thin** class wrappers (design-sync / lightweight `cyberdesign/react` export). Prefer `react-cyberdesign` for real app UI.

## Commands (from repo root)

```bash
pnpm install
pnpm build              # both packages
pnpm build:css          # packages/cyberdesign only
pnpm build:react        # packages/react-cyberdesign (needs CSS dist)
pnpm storybook          # http://localhost:6006
pnpm demo               # CSS harness on :4980 → /test/
pnpm typecheck
```

Build order matters: **CSS before React** (React copies `cyberdesign/dist/cyberdesign.css` → `dist/styles.css`).

## Adding CSS components

Work in `packages/cyberdesign`:

1. `src/css/components/<name>.css` — `--cd-*` tokens, `cd-` class prefix
2. Register in `build.ts` bundle array
3. Demo section in `test/index.html`
4. `pnpm build:css`

## Adding React components

Work in `packages/react-cyberdesign`:

1. Confirm CSS exists in `packages/cyberdesign`
2. `src/components/<Name>.tsx` — map props to `cd-*` classes via `cn`
3. Export from `src/index.ts`
4. `src/components/<Name>.stories.tsx` with `tags: ['autodocs']`
5. `pnpm typecheck` and `pnpm storybook`

Hard rules (React): never invent styling; only emit classes from cyberdesign CSS; use shared types from `src/lib/types.ts`.

## Themes

Apply `theme-orange` | `theme-cyan` | `theme-green` | `theme-red` | `theme-steel` on an ancestor (or use `ThemeProvider`).

## `_*/` directories

Gitignored internal reference material only. Never commit or depend on them.

## Detailed package docs

- [`packages/cyberdesign/CLAUDE.md`](./packages/cyberdesign/CLAUDE.md) — CSS conventions
- [`packages/react-cyberdesign/AGENTS.md`](./packages/react-cyberdesign/AGENTS.md) — React conventions
