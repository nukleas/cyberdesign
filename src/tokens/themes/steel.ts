import { palette } from '../base.js';

export const steelTheme: Record<string, string> = {
  'accent':              palette.steel,
  'accent-bright':       palette.steelBright,
  'accent-subtle':       'rgba(154, 175, 196, 0.12)',
  'accent-glow':         'rgba(154, 175, 196, 0.28)',
  'accent-subtle-glow':  'rgba(154, 175, 196, 0.16)',
  'border-glow':         'rgba(154, 175, 196, 0.18)',
  'scrollbar-thumb':     'rgba(154, 175, 196, 0.20)',
  'panel-shadow':        'inset 0 0 0 1px rgba(154, 175, 196, 0.06), 0 0 24px rgba(154, 175, 196, 0.06)',
  // complement: amber — warm tension against cool steel
  'accent-secondary':        '#ffaa00',
  'accent-secondary-glow':   'rgba(255, 170, 0, 0.28)',
  'accent-secondary-subtle': 'rgba(255, 170, 0, 0.12)',
};
