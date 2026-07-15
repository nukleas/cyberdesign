/**
 * Semantic color palette used across badges, cards, gauges, and accents.
 * Maps to `cd-*-{color}` modifier classes in cyberdesign CSS.
 */
export type CdColor =
  | 'orange'
  | 'amber'
  | 'gold'
  | 'cyan'
  | 'magenta'
  | 'green'
  | 'red'
  | 'blue'
  | 'purple'
  | 'yellow';

/**
 * Theme accent family applied via `.theme-*` on a root element
 * (typically `<html>` or {@link ThemeProvider}).
 */
export type CdTheme =
  | 'orange'
  | 'cyan'
  | 'green'
  | 'red'
  | 'steel';

/** Shared size scale used by form controls and buttons. */
export type CdSize = 'sm' | 'md' | 'lg' | 'xl';
