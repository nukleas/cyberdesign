export const palette = {
  // Backgrounds — unified range from both source apps
  bgBase:       '#05060a',   // AI-shell app's darkest
  bgPanel:      '#0b0f18',   // AI-shell app bg-light / dashboard app panel midpoint
  bgPanelHover: '#111827',   // AI-shell app bg-lighter / dashboard app hover midpoint
  bgDark:       '#0a0a0c',   // dashboard app's darkest (kept for compat)

  // Borders
  borderDim:    '#1e1e24',   // dashboard app --color-border-dim
  borderMid:    '#26324c',   // AI-shell app --border

  // Text — warm (dashboard app) and cool (AI-shell app) variants both exposed
  textPrimary:    '#e8e4e0', // dashboard app warm off-white
  textPrimaryAlt: '#f2f7ff', // AI-shell app cool white
  textSecondary:  '#a7b7d6', // AI-shell app --text-secondary
  textMuted:      '#8a8078', // bumped for WCAG AA 4.5:1+ (was #706860)
  textMutedAlt:   '#7a8599', // bumped for WCAG AA (was #687797, cooler variant)
  textDim:        '#6a625c', // bumped for ~3.3:1 large/decorative text (was #4a4440)

  // Orange family (dashboard app primary accent)
  orange:  '#ff8800',  // normalized from #f80
  amber:   '#ffaa00',  // normalized from #fa0
  gold:    '#ffcc00',  // normalized from #fc0

  // Cyan family (AI-shell app primary accent)
  cyan:       '#47f6ff',
  cyanBright: '#bdffff',

  // Shared secondary accents
  magenta:      '#ff2bd6',  // AI-shell app; close to dashboard app's #f0f
  magentaAlt:   '#ff00ff',  // dashboard app pure magenta (kept as alias)
  purple:       '#9d7cff',  // AI-shell app --purple / --violet
  green:        '#00ff00',  // dashboard app pure green
  greenBright:  '#52ff9f',  // AI-shell app --green-bright
  red:          '#ff4444',  // dashboard app #f44
  redAlt:       '#ff456c',  // AI-shell app --red
  redBright:    '#ff7777',  // lighter red for accent-bright
  blue:         '#4488ff',  // dashboard app #48f
  blueAlt:      '#6aa8ff',  // AI-shell app --ai-blue
  yellow:       '#f7ff5a',  // AI-shell app --viz-active

  // Steel / metallic family
  steel:        '#9aafc4',  // blue-grey steel
  steelBright:  '#c8d8e8',  // chrome highlight

  // Surface
  surfaceGlass: 'rgba(11, 15, 24, 0.94)',
} as const;
