import type { InputHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** When provided, renders the value label beside the track inside a `cd-slider-wrap`. */
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  /** Node shown in the trailing `cd-slider-value` label. When set, wraps in `cd-slider-wrap`. */
  valueLabel?: ReactNode;
}

/** Range slider — neon track with 3D thumb; optional trailing value label. */
export function Slider({ valueLabel, className = '', ...rest }: SliderProps) {
  const input = (
    <input type="range" className={cx('cd-slider', !valueLabel && className)} {...rest} />
  );

  if (valueLabel == null) return input;

  return (
    <div className={cx('cd-slider-wrap', className)}>
      <input type="range" className="cd-slider" {...rest} />
      <span className="cd-slider-value">{valueLabel}</span>
    </div>
  );
}
