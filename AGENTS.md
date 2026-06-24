# cyberdesign — agent context

Standalone npm package providing the shared design system for ocint and robostrudel. Pure CSS, TypeScript tokens, and one React component (GlowCard). No runtime framework dependency.

## Architecture

```
src/tokens/         TypeScript token definitions
  base.ts           raw hex palette
  semantic.ts       purpose-mapped --cd-* token names + values
  themes/orange.ts  accent-family overrides for .theme-orange
  themes/cyan.ts    accent-family overrides for .theme-cyan
  index.ts          re-exports all

build.ts            codegen script — reads tokens, reads src/css/, writes dist/

src/css/
  base.css          font load (JetBrains Mono), box-sizing reset, :root defaults
  utilities.css     glow helpers, scanlines, pixel-grid, glass, scrollbar, glitch
  animations.css    @keyframes + animation classes
  components/       one file per component (28 total)

src/react/          GlowCard.tsx — only React component
src/js/             charts.js — canvas chart helpers (CdLineChart, CdBarChart, etc.)

dist/               generated, gitignored — run `npm run build` to regenerate
  cyberdesign.css
  cyberdesign-vars-only.css
  tailwind-theme.css

test/index.html     visual demo harness — 31 sections, live theme toggle
```

### Package exports

| Import path | File | Contents |
|---|---|---|
| `cyberdesign` or `cyberdesign/css` | `dist/cyberdesign.css` | Full bundle — variables + base + utilities + all components |
| `cyberdesign/vars` | `dist/cyberdesign-vars-only.css` | CSS variables only (`:root`, `.theme-orange`, `.theme-cyan`) |
| `cyberdesign/tailwind` | `dist/tailwind-theme.css` | Variables + `@theme inline` block for Tailwind v4 |
| `cyberdesign/react` | `src/react/index.ts` | React components (GlowCard) |
| `cyberdesign/tokens` | `src/tokens/index.ts` | TypeScript token constants |

Consumers apply a theme class on `<html>`:

```html
<html class="theme-orange">   <!-- or theme-cyan -->
```

## Token pipeline

Tokens are defined in TypeScript and compiled to CSS by `build.ts`. Do not edit `dist/` directly.

```
src/tokens/base.ts       raw hex palette (backgrounds, text, color families)
src/tokens/semantic.ts   purpose-mapped --cd-* tokens (bg, text, accent, glow…)
src/tokens/themes/       orange.ts + cyan.ts accent-family overrides
        │
        └─▶ build.ts ──▶ dist/cyberdesign.css
                    └──▶ dist/cyberdesign-vars-only.css
                    └──▶ dist/tailwind-theme.css
```

`build.ts` imports token records and emits CSS blocks:

```ts
function block(selector: string, tokens: Record<string, string>): string {
  const lines = Object.entries(tokens)
    .map(([k, v]) => `  --cd-${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${lines}\n}`;
}
```

Keys in `semantic.ts` become `--cd-<key>` variables on `:root`. Theme files override accent-related tokens under `.theme-orange` and `.theme-cyan`.

`--cd-accent` is the semantic accent; it resolves to the active theme's accent color. Use `--cd-accent` in component CSS instead of `--cd-orange` or `--cd-cyan`.

### Key CSS variables

| Token | Purpose |
|---|---|
| `--cd-bg` | page background |
| `--cd-bg-panel` | card / panel background |
| `--cd-text` | primary text |
| `--cd-text-secondary` | dimmed text |
| `--cd-text-muted` | secondary labels/helpers (improved ~5:1 contrast) |
| `--cd-text-dim` | decorative/metadata (improved ~3.3:1) |
| `--cd-accent` | theme accent (orange or cyan) |
| `--cd-accent-bright` | brighter accent for glows |
| `--cd-magenta` | secondary accent (fixed) |
| `--cd-glow` | default glow color (matches accent) |
| `--cd-border` | border color |
| `--cd-font-mono` | JetBrains Mono |
| `--cd-text-xs` / `--cd-text-sm` / `--cd-text-base` etc. | rem-based type scale for a11y |

## CSS conventions

- All CSS classes are prefixed `cd-`. Modifiers use `--` (BEM-ish):

```html
<button class="cd-btn cd-btn--primary">Submit</button>
```

- CSS variables are all `--cd-*`. Never use raw hex values in component CSS — always reference a token:

```css
.cd-panel {
  background: var(--cd-bg-panel);
  border: 1px solid var(--cd-border);
  color: var(--cd-text);
}
```

## Adding a component

1. Create `src/css/components/<name>.css` — use `--cd-*` tokens, prefix classes with `cd-`.
2. Add a `readCss('components/<name>.css')` entry to the bundle array in `build.ts`.
3. Add a demo section to `test/index.html`.

Run `npm run build` to verify the bundle compiles cleanly.

## Adding a token

1. Add the raw value to `src/tokens/base.ts` if it is a new palette entry.
2. Map it to a semantic name in `src/tokens/semantic.ts` (key becomes `--cd-<key>`).
3. If it is theme-specific, add it to `src/tokens/themes/orange.ts` and/or `cyan.ts`.

Run `npm run build`.

## Adding a theme

1. Create `src/tokens/themes/<name>.ts` — export a `Record<string, string>` of overrides.
2. Import it in `build.ts` and add `block('.theme-<name>', <name>Theme)` to all three output files.
3. Add `.theme-<name>` class handling to `test/index.html` theme toggle.

## `_*/` directories

Directories matching `_*/` are gitignored (see `.gitignore`). They hold internal reference material only — for example `_references/` contains third-party design system snapshots used during development. Never commit or depend on files in `_*/`.

## Build and dev

```bash
npm run build    # one-shot: regenerate dist/
npm run dev      # watch mode — rebuilds dist/ on every src/ change
```

Preview the component demo:

```bash
npx serve . -p 4980
# open http://localhost:4980/test/
```

## `dist/` is generated

Everything under `dist/` is produced by `build.ts`. Each output file includes a header comment:

```css
/* cyberdesign v0.1.0 — generated by build.ts, DO NOT EDIT */
```

Never hand-edit files in `dist/`. Change `src/tokens/`, `src/css/`, or `build.ts`, then run `npm run build`.