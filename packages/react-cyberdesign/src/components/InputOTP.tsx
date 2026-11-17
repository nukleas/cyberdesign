import { Fragment, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { moveFocus } from '../lib/focus';

export interface InputOTPProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of digits. @default 6 */
  length?: number;
  /** The digits entered so far, without gaps. */
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Insert a separator after this many digits (e.g. 3 → XXX-XXX). */
  separatorAfter?: number;
}

/**
 * One-time-passcode digit inputs.
 *
 * The slots are one group (named "One-time code"; override with `aria-label`
 * or `aria-labelledby`) and one Tab stop, on the first empty slot. Each slot
 * is announced as "Digit N of M".
 *
 * Keyboard: typing a digit fills the slot and advances; typing on a filled
 * slot replaces it. Backspace clears the slot, or on an empty slot steps back
 * and clears the previous one. Delete clears the slot in place. ArrowLeft /
 * ArrowRight move between the filled slots and the first empty one, Home / End
 * jump to the first / last of them. Pasting (or SMS autofill) fills from the
 * focused slot onward.
 */
export function InputOTP({
  length = 6,
  value = '',
  onChange,
  disabled = false,
  size = 'md',
  separatorAfter,
  className = '',
  ...rest
}: InputOTPProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = value.slice(0, length);
  // The first empty slot (or the last slot when full): where typing continues.
  const entry = Math.min(chars.length, length - 1);

  const focusSlot = (index: number) => refs.current[Math.max(0, Math.min(index, length - 1))]?.focus();

  /** Write `digits` over the slots starting at `index`, then focus the slot after them. */
  const fill = (index: number, digits: string) => {
    const at = Math.min(index, chars.length);
    onChange?.((chars.slice(0, at) + digits + chars.slice(at + digits.length)).slice(0, length));
    focusSlot(at + digits.length);
  };

  const remove = (index: number) => onChange?.(chars.slice(0, index) + chars.slice(index + 1));

  return (
    <div
      role="group"
      aria-label="One-time code"
      className={cn('cd-input-otp', size === 'sm' && 'cd-input-otp--sm', className)}
      {...rest}
    >
      {Array.from({ length }, (_, i) => (
        <Fragment key={i}>
          {separatorAfter != null && i === separatorAfter && (
            <span className="cd-input-otp__sep" aria-hidden>
              -
            </span>
          )}
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn('cd-input-otp__slot', chars[i] && 'is-filled')}
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={disabled}
            tabIndex={i === entry ? 0 : -1}
            value={chars[i] ?? ''}
            aria-label={`Digit ${i + 1} of ${length}`}
            // Select the digit so typing replaces it.
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const typed = e.target.value.replace(/\D/g, '');
              if (!typed) {
                if (!e.target.value && chars[i]) remove(i);
                return;
              }
              // Several digits at once in an empty slot is autofill: spread them out.
              if (!chars[i]) fill(i, typed);
              // Otherwise keep the digit that was just typed, wherever the caret was.
              else fill(i, typed.length > 1 && typed.endsWith(chars[i]) ? typed[0] : typed.slice(-1));
            }}
            onKeyDown={(e) => {
              if (moveFocus(e, refs.current.slice(0, entry + 1) as HTMLInputElement[], {
                orientation: 'horizontal',
                loop: false,
              })) {
                return;
              }
              // A digit key always lands, even when it equals the digit already there.
              if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                fill(i, e.key);
              } else if (e.key === 'Backspace') {
                e.preventDefault();
                if (chars[i]) {
                  remove(i);
                  // In the middle, step back as a text caret would; at the end, stay on the emptied slot.
                  if (i < chars.length - 1) focusSlot(i - 1);
                } else if (i > 0) {
                  remove(i - 1);
                  focusSlot(i - 1);
                }
              } else if (e.key === 'Delete') {
                e.preventDefault();
                remove(i);
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const digits = e.clipboardData.getData('text').replace(/\D/g, '');
              if (digits) fill(i, digits);
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}
