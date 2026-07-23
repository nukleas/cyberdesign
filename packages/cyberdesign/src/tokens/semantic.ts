import { palette } from './base.js';

export const semanticTokens: Record<string, string> = {
  // Backgrounds
  'bg':             palette.bgBase,
  'bg-panel':       palette.bgPanel,
  'bg-panel-hover': palette.bgPanelHover,
  'bg-surface':     palette.surfaceGlass,

  // Borders
  'border':     palette.borderMid,
  'border-dim': palette.borderDim,

  // Text
  'text':           palette.textPrimary,
  'text-alt':       palette.textPrimaryAlt,
  'text-secondary': palette.textSecondary,
  'text-muted':     palette.textMuted,
  'text-muted-alt': palette.textMutedAlt,
  'text-dim':       palette.textDim,

  // Secondary accent — magenta, consistent across all themes
  'accent-secondary':        palette.magenta,
  'accent-secondary-glow':   'rgba(255, 43, 214, 0.32)',
  'accent-secondary-subtle': 'rgba(255, 43, 214, 0.12)',

  // Supporting neon palette (for explicit color-coded categories)
  'neon-green':    palette.greenBright,
  'neon-red':      palette.redAlt,
  'neon-blue':     palette.blueAlt,
  'neon-purple':   palette.purple,
  'neon-yellow':   palette.yellow,
  'neon-amber':    palette.amber,
  'neon-orange':   palette.orange,
  'neon-cyan':     palette.cyan,
  'neon-magenta':  palette.magenta,

  // Raw palette exposed for explicit use (category color maps, etc.)
  'orange':  palette.orange,
  'amber':   palette.amber,
  'gold':    palette.gold,
  'cyan':    palette.cyan,
  'magenta': palette.magenta,
  'purple':  palette.purple,
  'green':   palette.greenBright,
  'red':     palette.redAlt,
  'blue':    palette.blueAlt,
  'yellow':  palette.yellow,

  // CRT / effects
  'scanline-color':   'rgba(0, 0, 0, 0.18)',
  'pixel-grid-color': 'rgba(71, 246, 255, 0.055)',

  // Font
  'font-mono': '"JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace',

  // Typography scale (rem-based for accessibility + user font scaling)
  'text-xs':  '0.6875rem',  // ~11px — dense labels, badges, kbd
  'text-sm':  '0.75rem',    // ~12px — current "body"/inputs (transition)
  'text-base':'0.8125rem',  // ~13px — improved readable body, modals
  'text-md':  '0.875rem',   // ~14px — larger headings/titles
  'text-lg':  '0.9375rem',  // ~15px — prominent display
};
