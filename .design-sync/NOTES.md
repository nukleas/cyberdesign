# design-sync notes — cyberdesign

cyberdesign is a **CSS-first** design system: 34 CSS component stylesheets + tokens + 5 themes,
historically with only one React component (`GlowCard`). To make it usable by the claude.ai/design
agent, this sync adds **thin React binding components** under `src/react/` (one per CSS component,
~39 files) — the official React API for the `cd-*` class contract. The look ships via the full
`dist/cyberdesign.css` (referenced as `cfg.cssEntry`). The wrapper convention lives in
`.design-sync/WRAPPER-CONVENTION.md`.

## Build / discovery gotchas

- **`pnpm run <script>` is flaky here** (corepack 11.1.1 dep-status check crashes). Run build steps
  directly: `npx tsx build.ts && npx tsc -p tsconfig.types.json`. This is `cfg.buildCmd`.
- **Component discovery needs `.d.ts`.** The package historically shipped no declarations (React
  source is `.tsx`, compiled only to CSS), so the converter hit `[ZERO_MATCH]`. Fixed by emitting
  declarations via `tsconfig.types.json` → `dist/types/`, and adding `"types": "./dist/types/index.d.ts"`
  to package.json. The build script now emits them too, so re-sync reproduces. If a future run sees
  `[ZERO_MATCH]`, run `npx tsc -p tsconfig.types.json` first.
- **`react-dom` MUST be installed** (pinned to match `react`, currently 19.2.7). It was originally
  absent (only `react` was a peer dep). Without it the vendor React bundle has a mismatched/missing
  `window.ReactDOM`, and EVERY hook-using component (Tabs, Accordion, Dropdown, Modal, Pagination)
  renders blank with "Invalid hook call / more than one copy of React". Added as a devDependency.
- Playwright pinned to **1.59.1** to match the cached chromium build 1217 (avoids a download).
  `.ds-sync` installs its own playwright; the cache lives at `~/.cache/ms-playwright/`.

## Preview authoring gotchas

- **Previews must paint their own background.** The preview card host body is `#fff`; `--cd-bg`
  (the cyberpunk dark) is only on `:root` and doesn't reach the card. Every preview wraps its content
  in a `Frame` div with `style={{ background:'var(--cd-bg)', color:'var(--cd-text)', fontFamily:'var(--cd-font-mono)', padding:24 }}`.
- **The accent only resolves under a theme class.** `--cd-accent` is defined by `.theme-orange` /
  `.theme-cyan` / `.theme-green` / `.theme-red` / `.theme-steel`, NOT at `:root`. Previews put
  `className="theme-orange"` on the Frame so primary/accent variants show color. **Designs built with
  cyberdesign must also set a theme class on a root element** or the accent falls back to unstyled.
- Default theme is `theme-orange` (matches `test/index.html`'s `<html class="theme-orange">`).

## Sources of truth for composition

- `test/index.html` — the canonical DOM for every component (search its `cd-*` classes).
- `examples/neuromancer.html` — richer real-world compositions.

## Preview authoring notes (per component, for re-sync)

- **Form-control wrappers render only the control** (no `cd-field` label chrome). To show a labelled
  field, wrap in a plain `<label>` with an uppercase `--cd-text-muted` caption. Use `defaultChecked`
  (not `checked`) for on/checked states to avoid controlled-input warnings.
- **Tooltip is CSS `:hover`-only** — the tip bubble does NOT appear in a static screenshot. Its
  preview grades the trigger affordance (dashed accent underline), which is correct/expected.
- **Dropdown**: open menus overflow downward, so the Frame needs large `paddingBottom` (~280). Avoid
  `align="right"` in an isolated preview card — the wider menu clips off the left. Use `defaultOpen`.
- **Modal**: rendered via `open` + the `cfg.overrides.Modal` single-card 560x460 viewport.
- **Skeleton/SkeletonRow**: `SkeletonRow` only renders meaningfully inside a `Skeleton shape="block"`.
- **Interference glitch** needs both `glitch` and `corruptText` matching the visible heading text.
- **Gauge**: just pass `value` (0–100); the wrapper sets the `--value` CSS var.
- **Scanner/Interference** are transparent overlays — wrap real content in a sized `bg-panel` div.

## State

- An **opt-in accessibility layer** (`src/css/a11y.css`, `.cd-a11y` scope) is wired into the bundle
  via `build.ts` and ships in `dist/cyberdesign.css` → `_ds_bundle.css` → the synced `styles.css`.
  It overrides type scale + muted-text contrast + glow ONLY inside `.cd-a11y`; defaults are untouched,
  so all 42 component renderHashes are unchanged by it (a styling-only re-sync — no re-grading needed).
  Origin: the claude.ai/design web agent's `templates/accessible-theme/` suggestion, folded upstream.

## Re-sync risks

- The wrapper `.tsx` files in `src/react/` and their `.d.ts` are the API contract. If a CSS component
  gains/loses a modifier, update the matching wrapper + re-emit types.
- Declaration emission (`dist/types/`) is gitignored (under `dist/`) but reproduced by the build —
  the committed `tsconfig.types.json` + package.json `types`/`build` script carry it forward.
- Fonts load from a remote CDN (`@font-face` → jsdelivr JetBrains Mono); shows as `[FONT_REMOTE]`,
  nothing to ship, but designs need network access for the brand font.
- **Only partially verified statically:** Tooltip (hover-only tip never shows in capture), and the
  animated components (Ticker/Scanner/Interference) are screenshot mid-animation. These are graded on
  trigger/static state, which is the best a static render can show.
