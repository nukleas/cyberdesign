import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

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

export interface TerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title text (theme-accent colored). Omit to hide the header. */
  title?: ReactNode;
  /** Show the min/max/close window control dots in the header. */
  controls?: boolean;
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
  /** Props forwarded to the input field element. */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Extra body content rendered after `lines`. */
  children?: ReactNode;
}

/** Cyberpunk terminal/console window — header, scrollable log body and optional command input. */
export function Terminal({
  title,
  controls = false,
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
  return (
    <div
      className={cx(
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
            <div className="cd-terminal__controls">
              <span className="cd-terminal__dot cd-terminal__dot--min" title="Minimize" />
              <span className="cd-terminal__dot cd-terminal__dot--max" title="Maximize" />
              <span className="cd-terminal__dot cd-terminal__dot--close" title="Close" />
            </div>
          )}
        </div>
      )}
      <div className="cd-terminal__body cd-scrollbar">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cx('cd-terminal__line', line.type && `cd-terminal__line--${line.type}`)}
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
          <input className="cd-terminal__field" placeholder="type command..." {...inputProps} />
        </div>
      )}
    </div>
  );
}
