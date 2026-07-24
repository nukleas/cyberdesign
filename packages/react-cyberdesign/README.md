# react-cyberdesign

React component library for **[cyberdesign](../cyberdesign)** — dark cyberpunk / terminal UI with semantic props.

Visual styles come from cyberdesign CSS (`cd-*` classes, `--cd-*` tokens). This package provides typed React components, a theme provider, and Storybook documentation.

## Features

- **90+ components** — Dialog, Sheet, Card, Calendar, Command, Sidebar, Toggle, and every standard UI primitive you'd expect
- **Cyber extras** — GlowCard, Terminal, HUD, Gauge, Scanner, Interference
- **Semantic props** — `variant`, `size`, `color`, plus native HTML attributes
- **Multi themes** — `orange` · `cyan` · `green` · `red` · `steel`
- **Storybook autodocs** — prop tables from JSDoc
- **Zero style reinvention** — thin bindings over cyberdesign CSS

## Install

```bash
pnpm add @nukleas/react-cyberdesign
```

```tsx
// styles (required once in your app)
import '@nukleas/react-cyberdesign/styles.css';
```

## Quick start

```tsx
import {
  ThemeProvider,
  Button,
  Input,
  Field,
  Label,
  GlowCard,
  Badge,
} from '@nukleas/react-cyberdesign';
import '@nukleas/react-cyberdesign/styles.css';

export function App() {
  return (
    <ThemeProvider theme="cyan">
      <GlowCard color="cyan">
        <Field>
          <Label htmlFor="q">Query</Label>
          <Input id="q" placeholder="Search nodes…" accent />
        </Field>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="primary">Run</Button>
          <Badge color="green">ONLINE</Badge>
        </div>
      </GlowCard>
    </ThemeProvider>
  );
}
```

## Semantic props

| Prop | Purpose | Typical values |
| --- | --- | --- |
| `variant` | Emphasis or layout mode | `default`, `primary`, `danger`, `pills`, … |
| `size` | Density | `sm`, `md`, `lg`, `xl` |
| `color` | Palette family | `orange`, `cyan`, `magenta`, `green`, … |
| native attrs | Full element surface | `disabled`, `onClick`, `aria-*`, `className` |

Example (Button):

```tsx
<Button variant="primary" size="sm" disabled={loading}>
  Deploy
</Button>
```

## Theme

`--cd-accent` and primary styles only resolve under a theme class:

```tsx
<ThemeProvider theme="orange">{/* app */}</ThemeProvider>
// or on <html className="theme-cyan">
```

## Develop

From the monorepo root (this is a pnpm workspace):

```bash
pnpm install
pnpm build        # CSS first, then React (dist/ ESM + CJS + types + styles.css)
pnpm storybook    # http://localhost:6006
pnpm typecheck
```

## Package layout

```
src/
  components/     React components + Storybook stories
  lib/            cn(), shared types (CdColor, CdTheme, CdSize)
  theme/          ThemeProvider + useTheme
  styles/         CSS entry for Storybook (imports cyberdesign)
  index.ts        public API
```

## Relationship to cyberdesign

| Package | Responsibility |
| --- | --- |
| `@nukleas/cyberdesign` | Tokens, CSS components, Tailwind theme export |
| `@nukleas/react-cyberdesign` | React API, docs, theme provider |

When CSS gains a new modifier, update the matching React prop map here and add/adjust a story.

## License

MIT
