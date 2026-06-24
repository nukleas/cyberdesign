import type { TextareaHTMLAttributes } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state — red border. */
  error?: boolean;
}

/** Cyber multi-line text area — vertical resize, neon focus ring, error state. */
export function Textarea({ error = false, className = '', ...rest }: TextareaProps) {
  return (
    <textarea
      className={cx('cd-textarea', error && 'cd-textarea--error', className)}
      {...rest}
    />
  );
}
