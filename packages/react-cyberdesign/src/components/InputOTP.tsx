import { useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface InputOTPProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of digits. @default 6 */
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Insert a separator after this many digits (e.g. 3 → XXX-XXX). */
  separatorAfter?: number;
}

/** One-time-passcode digit inputs with focus advance. */
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
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const setAt = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d === ' ' ? '' : d));
    const joined = next.join('').replace(/\s/g, '').slice(0, length);
    onChange?.(joined);
  };

  return (
    <div className={cn('cd-input-otp', size === 'sm' && 'cd-input-otp--sm', className)} {...rest}>
      {Array.from({ length }, (_, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {separatorAfter != null && i === separatorAfter && (
            <span className="cd-input-otp__sep" aria-hidden>
              -
            </span>
          )}
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn('cd-input-otp__slot', digits[i] && digits[i] !== ' ' && 'is-filled')}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digits[i] === ' ' ? '' : digits[i]}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(-1);
              setAt(i, v);
              if (v && i < length - 1) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) {
                refs.current[i - 1]?.focus();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
              if (paste) onChange?.(paste);
            }}
          />
        </span>
      ))}
    </div>
  );
}
