import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Radio } from './Radio';

export interface RadioGroupItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Shared `name` for the radio inputs. */
  name: string;
  items: RadioGroupItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Stack vertically (default) or horizontally. */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Group of labelled radio options with shared name.
 *
 * Keyboard: native radio inputs, so the browser provides the WAI-ARIA Radio Group
 * behaviour. The group is one Tab stop (the checked option, else the first);
 * Up / Down / Left / Right move to the previous / next option and check it,
 * wrapping; Space checks the focused option. Disabled options are skipped.
 * Name the group with `aria-label` or `aria-labelledby`.
 */
export function RadioGroup({
  name,
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  className = '',
  ...rest
}: RadioGroupProps) {
  return (
    <div
      className={cn(className)}
      role="radiogroup"
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? 16 : 8,
      }}
      {...rest}
    >
      {items.map((item) => (
        <Radio
          key={item.value}
          name={name}
          value={item.value}
          label={item.label}
          description={item.description}
          disabled={item.disabled}
          defaultChecked={defaultValue === item.value}
          checked={value != null ? value === item.value : undefined}
          onChange={() => onValueChange?.(item.value)}
        />
      ))}
    </div>
  );
}
