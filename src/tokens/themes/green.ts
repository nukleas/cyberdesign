import { palette } from '../base.js';

export const greenTheme: Record<string, string> = {
  'accent':              palette.green,
  'accent-bright':       palette.greenBright,
  'accent-subtle':       'rgba(0, 255, 0, 0.12)',
  'accent-glow':         'rgba(0, 255, 0, 0.34)',
  'accent-subtle-glow':  'rgba(0, 255, 0, 0.20)',
  'border-glow':         'rgba(0, 255, 0, 0.20)',
  'scrollbar-thumb':     'rgba(0, 255, 0, 0.20)',
  'panel-shadow':        'inset 0 0 0 1px rgba(0, 255, 0, 0.04), 0 0 24px rgba(0, 255, 0, 0.07)',
  // complement: purple — avoids green+magenta clash
  'accent-secondary':        '#9d7cff',
  'accent-secondary-glow':   'rgba(157, 124, 255, 0.32)',
  'accent-secondary-subtle': 'rgba(157, 124, 255, 0.12)',
};
