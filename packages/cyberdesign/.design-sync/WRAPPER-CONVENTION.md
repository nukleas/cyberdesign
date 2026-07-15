# cyberdesign React wrapper convention

We are adding **thin React binding components** to `src/react/` — the official React API
for cyberdesign's CSS contract. These are NOT reimplementations: each wrapper only applies
the existing `cd-*` classes and renders the documented DOM structure. The look comes entirely
from `dist/cyberdesign.css`.

## Hard rules

1. **One file per component**: `src/react/<Name>.tsx`. PascalCase filename = export name.
2. **Never invent styling.** Only emit `cd-*` classes that exist in the component's CSS file
   (`src/css/components/<x>.css`). No inline styles except where the CSS contract itself uses a
   CSS variable hook (e.g. gauge `--value`, avatar `--cd-avatar-size`) — pass those via `style`.
3. **Extend native HTML attributes** so the design agent gets `onClick`, `disabled`, `id`, etc.:
   `export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { … }`.
   Use the correct element interface (`HTMLAttributes<HTMLDivElement>`, `InputHTMLAttributes`, …).
4. **Always accept and merge `className`**, and **spread `...rest`** onto the root element.
   If a prop name collides with a native attribute of a different type (`title`, `color`,
   `content`), `Omit` it from the extended interface:
   `extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'>`.
5. **Map variant/size props to modifier classes** with a small `clsx`-style join. Default variant
   emits no modifier. Use the helper below — copy it inline (no shared import; keeps each file standalone).
6. **TypeScript, function components, named export.** Match the existing `GlowCard.tsx` style.
   No `React.FC`. Import types from `'react'` with `import type`.
7. **Compound widgets**: attach sub-parts as static properties via `Object.assign`
   (e.g. `Accordion.Item`), OR expose a data-driven prop API where that's the natural usage
   (Tabs `items`, Breadcrumb `items`). Prefer whichever makes a one-line usage realistic.
8. **Interactive widgets** (Tabs, Accordion via `<details>`, Modal, Dropdown, Toast): use
   `useState` for open/active where it makes the component work standalone. Keep it uncontrolled
   by default with an optional controlled prop. Keep handlers named `onXxx`.
9. Realistic prop names, JSDoc one-liner above each exported component (the converter reads the
   leading JSDoc into the `.prompt.md`).
10. Do NOT edit `src/react/index.ts` — the orchestrator assembles the barrel.

## The class-join helper (paste into each file that needs it)

```tsx
const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');
```

## Color union (shared palette — copy where a component takes a color)

```tsx
type CdColor =
  | 'orange' | 'amber' | 'gold' | 'cyan' | 'magenta'
  | 'green' | 'red' | 'blue' | 'purple' | 'yellow';
```

## Reference: primitive (Button.tsx) — see src/react/Button.tsx
## Reference: structural with sub-elements (Alert.tsx) — see src/react/Alert.tsx
## Reference: interactive data-driven compound (Tabs.tsx) — see src/react/Tabs.tsx

Study those three before writing yours. Match their shape exactly.

## How to discover a component's contract

1. Read `src/css/components/<x>.css` — every `.cd-x--modifier` is a variant/size/state prop;
   every `.cd-x__part` is a sub-element you must render (structural) or expose.
2. Read the matching section in `test/index.html` for the canonical DOM (search the file for the
   component's `cd-` class). That HTML is the ground truth for structure and attributes
   (e.g. `data-status` on Avatar, `data-active` on GlowCard, `is-active` / `is-open` state classes).
3. `examples/neuromancer.html` has additional real compositions.
