import { useRef } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useScrollTabStop } from '../lib/useScrollTabStop';

/** Semantic line kinds — map to `cd-terminal__line--*` modifiers. */
export type TerminalLineType = 'system' | 'prompt' | 'command' | 'output' | 'error';

export interface TerminalLine {
  /** Line text content. */
  text: ReactNode;
  /** Line kind; omit for the default (plain) line. */
  type?: TerminalLineType;
  /** Prompt glyph shown before the text (for `prompt` lines, e.g. `root@net> `). */
  prompt?: ReactNode;
}

/** A header window control. */
export type TerminalControl = 'minimize' | 'maximize' | 'close';

const CONTROLS: { action: TerminalControl; modifier: string; label: string }[] = [
  { action: 'minimize', modifier: 'min', label: 'Minimize' },
  { action: 'maximize', modifier: 'max', label: 'Maximize' },
  { action: 'close', modifier: 'close', label: 'Close' },
];

export interface TerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title text (theme-accent colored). Omit to hide the header. */
  title?: ReactNode;
  /** Show the min/max/close window control dots in the header. */
  controls?: boolean;
  /**
   * Makes the window control dots real buttons and receives the one that was
   * pressed. Without it the dots are decoration, hidden from assistive tech.
   */
  onControl?: (control: TerminalControl) => void;
  /** The log lines to render in the body. */
  lines?: TerminalLine[];
  /** Tighter spacing / smaller type. */
  compact?: boolean;
  /** Extra CRT inner scanline overlay. */
  crt?: boolean;
  /** Render a bottom command input row. */
  input?: boolean;
  /** Prompt glyph shown before the input field. */
  inputPrompt?: ReactNode;
  /** Props forwarded to the input field element (named "Command" unless given an `aria-label`). */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Extra body content rendered after `lines`. */
  children?: ReactNode;
}

/**
 * Cyberpunk terminal/console window — header, scrollable log body and optional command input.
 *
 * When the log overflows and holds nothing focusable, the body is a Tab stop so
 * the arrow keys, PageUp / PageDown and Home / End scroll it.
 */
export function Terminal({
  title,
  controls = false,
  onControl,
  lines = [],
  compact = false,
  crt = false,
  input = false,
  inputPrompt = 'root@net> ',
  inputProps,
  className = '',
  children,
  ...rest
}: TerminalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyTabStop = useScrollTabStop(bodyRef);

  return (
    <div
      className={cn(
        'cd-terminal',
        compact && 'cd-terminal--compact',
        crt && 'cd-terminal--crt',
        className,
      )}
      {...rest}
    >
      {(title != null || controls) && (
        <div className="cd-terminal__header">
          {title != null && <span className="cd-terminal__title">{title}</span>}
          {controls && (
            <div className="cd-terminal__controls" aria-hidden={onControl ? undefined : true}>
              {CONTROLS.map(({ action, modifier, label }) =>
                onControl ? (
                  <button
                    key={action}
                    type="button"
                    className={`cd-terminal__dot cd-terminal__dot--${modifier}`}
                    aria-label={label}
                    title={label}
                    onClick={() => onControl(action)}
                  />
                ) : (
                  <span key={action} className={`cd-terminal__dot cd-terminal__dot--${modifier}`} />
                ),
              )}
            </div>
          )}
        </div>
      )}
      <div
        ref={bodyRef}
        className="cd-terminal__body cd-scrollbar"
        {...(bodyTabStop && { tabIndex: 0, role: 'group', 'aria-label': 'Terminal output' })}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn('cd-terminal__line', line.type && `cd-terminal__line--${line.type}`)}
          >
            {line.prompt != null && <span className="cd-terminal__prompt">{line.prompt}</span>}
            {line.text}
          </div>
        ))}
        {children}
      </div>
      {input && (
        <div className="cd-terminal__input">
          {inputPrompt != null && <span className="cd-terminal__prompt">{inputPrompt}</span>}
          <input
            className="cd-terminal__field"
            placeholder="type command..."
            aria-label="Command"
            {...inputProps}
          />
        </div>
      )}
    </div>
  );
}
