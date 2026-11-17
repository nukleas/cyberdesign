import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { useActiveDescendant } from '../lib/activeDescendant';
import { fuzzyRank } from '../lib/fuzzy';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ComboboxOption[];
  /** Controlled value. `''` means nothing is selected. */
  value?: string;
  defaultValue?: string;
  /** Called with the chosen option's value, or `''` when the selection is cleared with Escape. */
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  /** Id of the text input, so a `<label htmlFor>` can name it. */
  id?: string;
  /** Accessible name of the text input and its list. */
  'aria-label'?: string;
  /** Id of the element that names the text input and its list. */
  'aria-labelledby'?: string;
}

/**
 * Searchable select: typing filters and ranks the options with the same
 * `fuzzyRank` matcher as `Command`.
 *
 * Keyboard (WAI-ARIA combobox with list autocomplete): focus stays in the
 * input, which names the highlighted option through `aria-activedescendant`.
 * ArrowDown / ArrowUp open the list and move the highlight, PageDown / PageUp
 * move a screenful, Home / End go to the first / last option, Enter selects,
 * Escape closes the list and, pressed again, clears the selection. Tab moves on
 * and closes the list without selecting. Disabled options are skipped.
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select…',
  emptyText = 'No matches',
  disabled = false,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className = '',
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  // What was typed since the list opened. Null until the user types, so opening
  // with the arrow keys keeps the selected label in the input and lists everything.
  const [query, setQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = value ?? internal;

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';

  const filtered = useMemo(
    () =>
      fuzzyRank(
        options,
        query ?? '',
        (o) => o.label,
        (o) => o.value,
      ),
    [options, query],
  );
  const nav = useActiveDescendant(listRef, filtered.length, (i) => filtered[i].disabled === true);

  const close = () => {
    setOpen(false);
    setQuery(null);
  };

  const select = (next: string) => {
    if (value == null) setInternal(next);
    onChange?.(next);
    close();
  };

  /** Open the unfiltered list on the selected option, else on its first or last one. */
  const show = (fallback: 'first' | 'last' = 'first') => {
    const at = options.findIndex((o) => o.value === selected);
    setOpen(true);
    nav.setActive(at >= 0 ? at : fallback === 'first' ? 0 : options.length - 1);
  };

  // Escape is handled natively so that, inside a dialog or sheet, it reaches this
  // input before the overlay's own Escape listener and only closes the list.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (!open && !selected)) return;
      event.preventDefault();
      event.stopPropagation();
      if (open) close();
      else select('');
    };
    input.addEventListener('keydown', onEscape);
    return () => input.removeEventListener('keydown', onEscape);
  });

  return (
    <div className={cn('cd-combobox', open && 'is-open', className)} {...rest}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="cd-input"
        role="combobox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open ? nav.activeId : undefined}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={query ?? selectedLabel}
        onClick={() => {
          if (!open) show();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          nav.setActive(0);
        }}
        onKeyDown={(e) => {
          if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              show(e.key === 'ArrowDown' ? 'first' : 'last');
            }
            return;
          }
          if (nav.onKeyDown(e)) return;
          if (e.key === 'Enter' && nav.active >= 0) {
            e.preventDefault();
            select(filtered[nav.active].value);
          }
        }}
        onBlur={close}
      />
      <div
        ref={listRef}
        id={listId}
        className="cd-combobox__menu"
        role="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        // Clicking an option must not take focus out of the input.
        onMouseDown={(e) => e.preventDefault()}
      >
        {filtered.length === 0 && (
          <div className="cd-command__empty" style={{ padding: 12 }}>
            {emptyText}
          </div>
        )}
        {filtered.map((opt, i) => {
          const isActive = i === nav.active;
          return (
            <div
              key={opt.value}
              id={nav.optionId(i)}
              role="option"
              aria-selected={isActive}
              aria-disabled={opt.disabled || undefined}
              className="cd-combobox__option"
              onMouseMove={() => {
                if (!isActive && !opt.disabled) nav.setActive(i, false);
              }}
              onClick={() => {
                if (!opt.disabled) select(opt.value);
              }}
            >
              {opt.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
