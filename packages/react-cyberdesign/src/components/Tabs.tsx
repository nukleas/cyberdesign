import { useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { moveFocus } from '../lib/focus';

export interface TabItem {
  /** Tab label (also the trigger text). */
  label: ReactNode;
  /** Panel content shown when this tab is active. */
  content?: ReactNode;
  /** Optional trailing badge node in the trigger (e.g. a count). */
  badge?: ReactNode;
  /** Disable selection of this tab. */
  disabled?: boolean;
}

export interface TabsProps {
  /** The tabs to render, in order. */
  items: TabItem[];
  /** Layout style: underline (default), pills, or vertical. */
  variant?: 'underline' | 'pills' | 'vertical';
  /** Index of the initially-active tab (uncontrolled). */
  defaultActive?: number;
  /** Controlled active index. When set, `onTabChange` should update it. */
  active?: number;
  /** Fires with the new index when a tab is selected. */
  onTabChange?: (index: number) => void;
  /** Hide the panels region (trigger-only, e.g. a filter bar). */
  hidePanels?: boolean;
  className?: string;
}

/**
 * Tabbed navigation — underline / pills / vertical, with optional badges and panels.
 *
 * Keyboard (WAI-ARIA Tabs, automatic activation): the tab list is one Tab stop,
 * the selected tab. Left / Right (Up / Down when vertical) move to the previous /
 * next tab and select it, wrapping at the ends; Home / End go to the first / last.
 * Disabled tabs are skipped. Tab moves on to the active panel.
 */
export function Tabs({
  items,
  variant = 'underline',
  defaultActive = 0,
  active,
  onTabChange,
  hidePanels = false,
  className = '',
}: TabsProps) {
  const [internal, setInternal] = useState(defaultActive);
  const current = active ?? internal;
  const id = useId();
  // The one Tab stop: the selected tab, or the first enabled one if it cannot take focus.
  const tabStop =
    items[current] && !items[current].disabled
      ? current
      : items.findIndex((item) => !item.disabled);

  const select = (i: number) => {
    if (items[i]?.disabled) return;
    if (active == null) setInternal(i);
    onTabChange?.(i);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(event.currentTarget.children) as HTMLElement[];
    const next = moveFocus(
      event,
      tabs.filter((_, i) => !items[i].disabled),
      { orientation: variant === 'vertical' ? 'vertical' : 'horizontal' },
    );
    if (next) select(tabs.indexOf(next));
  };

  return (
    <div
      className={cn(
        'cd-tabs',
        variant === 'pills' && 'cd-tabs--pills',
        variant === 'vertical' && 'cd-tabs--vertical',
        className,
      )}
    >
      <div
        className="cd-tabs__list"
        role="tablist"
        aria-orientation={variant === 'vertical' ? 'vertical' : undefined}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === current}
            aria-controls={hidePanels ? undefined : `${id}-panel-${i}`}
            tabIndex={i === tabStop ? 0 : -1}
            disabled={item.disabled}
            className={cn('cd-tabs__trigger', i === current && 'is-active')}
            onClick={() => select(i)}
          >
            {item.label}
            {item.badge != null && (
              <span className="cd-badge cd-badge--orange" style={{ marginLeft: 4 }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {!hidePanels && (
        <div className="cd-tabs__panels">
          {items.map((item, i) => (
            <div
              key={i}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              tabIndex={0}
              className={cn('cd-tabs__panel', i === current && 'is-active')}
            >
              {item.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
