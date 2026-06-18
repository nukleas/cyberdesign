export const palette = {
  // Backgrounds — unified range from both projects
  bgBase:       '#05060a',   // robostrudel's darkest
  bgPanel:      '#0b0f18',   // robostrudel bg-light / ocint panel midpoint
  bgPanelHover: '#111827',   // robostrudel bg-lighter / ocint hover midpoint
  bgDark:       '#0a0a0c',   // ocint's darkest (kept for compat)

  // Borders
  borderDim:    '#1e1e24',   // ocint --color-border-dim
  borderMid:    '#26324c',   // robostrudel --border

  // Text — warm (ocint) and cool (robostrudel) variants both exposed
  textPrimary:    '#e8e4e0', // ocint warm off-white
  textPrimaryAlt: '#f2f7ff', // robostrudel cool white
  textSecondary:  '#a7b7d6', // robostrudel --text-secondary
  textMuted:      '#706860', // ocint --color-text-muted
  textMutedAlt:   '#687797', // robostrudel --text-muted
  textDim:        '#4a4440', // ocint --color-text-dim

  // Orange family (ocint primary accent)
  orange:  '#ff8800',  // normalized from #f80
  amber:   '#ffaa00',  // normalized from #fa0
  gold:    '#ffcc00',  // normalized from #fc0

  // Cyan family (robostrudel primary accent)
  cyan:       '#47f6ff',
  cyanBright: '#bdffff',

  // Shared secondary accents
  magenta:      '#ff2bd6',  // robostrudel; close to ocint's #f0f
  magentaAlt:   '#ff00ff',  // ocint pure magenta (kept as alias)
  purple:       '#9d7cff',  // robostrudel --purple / --violet
  green:        '#00ff00',  // ocint pure green
  greenBright:  '#52ff9f',  // robostrudel --green-bright
  red:          '#ff4444',  // ocint #f44
  redAlt:       '#ff456c',  // robostrudel --red
  blue:         '#4488ff',  // ocint #48f
  blueAlt:      '#6aa8ff',  // robostrudel --ai-blue
  yellow:       '#f7ff5a',  // robostrudel --viz-active

  // Surface
  surfaceGlass: 'rgba(11, 15, 24, 0.94)',
} as const;
