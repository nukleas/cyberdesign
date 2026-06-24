import { palette } from '../base.js';

export const redTheme: Record<string, string> = {
  'accent':              palette.red,
  'accent-bright':       palette.redBright,
  'accent-subtle':       'rgba(255, 68, 68, 0.12)',
  'accent-glow':         'rgba(255, 68, 68, 0.34)',
  'accent-subtle-glow':  'rgba(255, 68, 68, 0.20)',
  'border-glow':         'rgba(255, 68, 68, 0.20)',
  'scrollbar-thumb':     'rgba(255, 68, 68, 0.20)',
  'panel-shadow':        'inset 0 0 0 1px rgba(255, 68, 68, 0.04), 0 0 24px rgba(255, 68, 68, 0.07)',
  // complement: blue — cool contrast against hot red
  'accent-secondary':        '#6aa8ff',
  'accent-secondary-glow':   'rgba(106, 168, 255, 0.32)',
  'accent-secondary-subtle': 'rgba(106, 168, 255, 0.12)',
};
