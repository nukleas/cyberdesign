# cyberdesign — developer context

Standalone npm package providing the shared design system for ocint and robostrudel. Pure CSS + TypeScript tokens + one React component (GlowCard). No runtime framework dependency.

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

## Conventions

- All CSS classes are prefixed `cd-`. Modifiers use `--` (BEM-ish): `cd-btn cd-btn--primary`.
- CSS variables are all `--cd-*`. Never use raw hex values in component CSS — always reference a token.
- `--cd-accent` is the semantic accent; it resolves to the active theme's accent color. Use this instead of `--cd-orange` or `--cd-cyan` in component CSS.
- `_*/` directories are gitignored and for internal reference only. Never commit them.

## Adding a component

1. Create `src/css/components/<name>.css` — use `--cd-*` tokens, prefix classes with `cd-`
2. Add a `readCss('components/<name>.css')` entry to the bundle array in `build.ts`
3. Add a demo section to `test/index.html`
4. Run `npm run build` to verify the bundle compiles cleanly

## Adding a token

1. Add the raw value to `src/tokens/base.ts` if it's a new palette entry
2. Map it to a semantic name in `src/tokens/semantic.ts` (key becomes `--cd-<key>`)
3. If it's theme-specific, add it to `src/tokens/themes/orange.ts` and/or `cyan.ts`
4. Run `npm run build`

## Adding a theme

1. Create `src/tokens/themes/<name>.ts` — export a `Record<string, string>` of overrides
2. Import it in `build.ts` and add `block('.theme-<name>', <name>Theme)` to all three output files
3. Add `.theme-<name>` class handling to `test/index.html` theme toggle

## Dev workflow

```bash
npm run dev              # watch mode — rebuilds dist/ on every src/ change
npx serve . -p 4980      # serve from repo root; open http://localhost:4980/test/
```

## Key CSS variables

| Token | Purpose |
|---|---|
| `--cd-bg` | page background |
| `--cd-bg-panel` | card / panel background |
| `--cd-text` | primary text |
| `--cd-text-secondary` | dimmed text |
| `--cd-accent` | theme accent (orange or cyan) |
| `--cd-accent-bright` | brighter accent for glows |
| `--cd-magenta` | secondary accent (fixed) |
| `--cd-glow` | default glow color (matches accent) |
| `--cd-border` | border color |
| `--cd-font-mono` | JetBrains Mono |
