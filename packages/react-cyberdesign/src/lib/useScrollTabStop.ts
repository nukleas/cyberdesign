import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { tabbable } from './focus';

/**
 * Whether the scroll container in `ref` needs its own Tab stop to be scrollable
 * from the keyboard: true while its content overflows and nothing inside it can
 * take focus. Give it `tabIndex={0}` and a role (and a label) while this holds.
 *
 * A container that fits its content, or that already holds a focusable element
 * (focusing it scrolls it into view, and the arrow keys then scroll the
 * container), gets no extra stop. Re-checked when the container resizes or its
 * content changes.
 */
export function useScrollTabStop(ref: RefObject<HTMLElement | null>): boolean {
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const overflows = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      setNeeded(overflows && tabbable(el).length === 0);
    };
    check();
    const resize = new ResizeObserver(check);
    resize.observe(el);
    const mutation = new MutationObserver(check);
    mutation.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [ref]);

  return needed;
}
