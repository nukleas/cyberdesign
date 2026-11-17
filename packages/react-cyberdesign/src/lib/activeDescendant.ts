import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Active-descendant navigation for combobox-style widgets (`Combobox`,
 * `Command`): DOM focus stays in the text input while one option in a list is
 * "active". The input points at it with `aria-activedescendant`; the options
 * are never focusable. For widgets where DOM focus itself moves, use
 * `moveFocus` from `./focus` instead.
 */
export interface ActiveDescendant {
  /** Index of the active option, or -1 when there is no enabled option. */
  active: number;
  /** DOM id of the active option, for `aria-activedescendant`. */
  activeId: string | undefined;
  /** DOM id for the option at `index`. */
  optionId: (index: number) => string;
  /**
   * Make `index` active (the nearest enabled option is used if it is disabled
   * or out of range). `scroll: false` leaves the list where it is, for pointer hover.
   */
  setActive: (index: number, scroll?: boolean) => void;
  /**
   * Handle a navigation key from the input's `keydown`: ArrowDown / ArrowUp,
   * Home / End, PageDown / PageUp, all without modifiers (so Shift+Home still
   * selects text). Returns true, after `preventDefault`, when the key was handled.
   */
  onKeyDown: (event: {
    key: string;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    preventDefault: () => void;
  }) => boolean;
}

/**
 * @param listRef    the scrolling element that contains the options
 * @param count      number of options, in display order
 * @param isDisabled options that can never be active
 */
export function useActiveDescendant(
  listRef: RefObject<HTMLElement | null>,
  count: number,
  isDisabled: (index: number) => boolean = () => false,
): ActiveDescendant {
  const baseId = useId();
  const [stored, setStored] = useState(0);
  const scrollPending = useRef(false);

  const optionId = (index: number) => `${baseId}-option-${index}`;

  /** First enabled option at or after `start` going in `dir`, or -1. */
  const seek = (start: number, dir: 1 | -1) => {
    for (let i = start; i >= 0 && i < count; i += dir) if (!isDisabled(i)) return i;
    return -1;
  };
  /** Nearest enabled option to `index`, preferring `dir`. */
  const nearest = (index: number, dir: 1 | -1 = 1) => {
    const start = Math.max(0, Math.min(index, count - 1));
    const found = seek(start, dir);
    return found >= 0 ? found : seek(start, dir === 1 ? -1 : 1);
  };

  const active = nearest(stored);
  const first = seek(0, 1);

  const setActive = (index: number, scroll = true) => {
    scrollPending.current = scroll;
    setStored(index);
  };

  // Keep the active option inside the scrolling list after a keyboard move.
  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    const list = listRef.current;
    if (!list) return;
    // At the first option, scroll to the very top so a group heading above it shows.
    if (active <= first) {
      list.scrollTop = 0;
      return;
    }
    const option = document.getElementById(optionId(active));
    if (!option) return;
    const l = list.getBoundingClientRect();
    const o = option.getBoundingClientRect();
    if (o.top < l.top) list.scrollTop -= l.top - o.top;
    else if (o.bottom > l.bottom) list.scrollTop += o.bottom - l.bottom;
  });

  const onKeyDown: ActiveDescendant['onKeyDown'] = (event) => {
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
    const page = () => {
      const option = document.getElementById(optionId(active));
      const list = listRef.current;
      if (!option || !list || !option.offsetHeight) return 10;
      return Math.max(1, Math.floor(list.clientHeight / option.offsetHeight));
    };
    const step = (dir: 1 | -1) => {
      const next = seek(active + dir, dir);
      return next >= 0 ? next : active;
    };

    let next: number;
    if (event.key === 'ArrowDown') next = step(1);
    else if (event.key === 'ArrowUp') next = step(-1);
    else if (event.key === 'Home') next = first;
    else if (event.key === 'End') next = seek(count - 1, -1);
    else if (event.key === 'PageDown') next = nearest(active + page(), 1);
    else if (event.key === 'PageUp') next = nearest(active - page(), -1);
    else return false;

    event.preventDefault();
    setActive(next);
    return true;
  };

  return {
    active,
    activeId: active >= 0 ? optionId(active) : undefined,
    optionId,
    setActive,
    onKeyDown,
  };
}
