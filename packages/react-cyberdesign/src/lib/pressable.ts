import type { KeyboardEvent } from 'react';

/**
 * `keydown` handler for a non-button element that acts as one (`role="button"`,
 * `tabIndex={0}`): Enter and Space click it, as they would a native button.
 * Keys pressed on a control inside the element are left to that control.
 */
export function pressOnKey(event: KeyboardEvent<HTMLElement>): void {
  if (event.target !== event.currentTarget) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  event.currentTarget.click();
}
