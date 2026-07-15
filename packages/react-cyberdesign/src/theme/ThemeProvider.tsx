import {
  createContext,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import type { CdTheme } from '../lib/types';

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Active accent theme. Sets `theme-{name}` so semantic tokens
   * like `--cd-accent` resolve correctly.
   * @default 'orange'
   */
  theme?: CdTheme;
  /**
   * Opt into the accessibility type/contrast layer (`.cd-a11y`).
   * @default false
   */
  a11y?: boolean;
  children?: ReactNode;
}

const ThemeContext = createContext<CdTheme>('orange');

/** Read the nearest {@link ThemeProvider} theme (falls back to `orange`). */
export function useTheme(): CdTheme {
  return useContext(ThemeContext);
}

/**
 * Root theme scope for cyberdesign. Apply once near the app root so
 * accent tokens (`--cd-accent`, glows, primary buttons) resolve.
 *
 * ```tsx
 * <ThemeProvider theme="cyan">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  theme = 'orange',
  a11y = false,
  className,
  children,
  ...rest
}: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={cn(`theme-${theme}`, a11y && 'cd-a11y', className)}
        data-cd-theme={theme}
        {...rest}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
