import type { HTMLAttributes, DetailsHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { moveFocus } from '../lib/focus';

export interface AccordionItemData {
  /** Trigger heading text. */
  title: ReactNode;
  /** Body content revealed when open. */
  content: ReactNode;
  /** Optional icon glyph before the title. */
  icon?: ReactNode;
  /** Render this item open initially. */
  defaultOpen?: boolean;
}

export interface AccordionItemProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** Trigger heading text. */
  title: ReactNode;
  /** Optional icon glyph before the title. */
  icon?: ReactNode;
  /** Body content. */
  children?: ReactNode;
}

/** Single `<details>` accordion row — for manual composition under `<Accordion>`. */
function AccordionItem({ title, icon, children, className = '', ...rest }: AccordionItemProps) {
  return (
    <details className={cn('cd-accordion__item', className)} {...rest}>
      <summary className="cd-accordion__trigger">
        {icon != null && <span className="cd-accordion__icon">{icon}</span>}
        {title}
      </summary>
      <div className="cd-accordion__body">
        <div className="cd-accordion__content">
          <div className="cd-accordion__content-inner">{children}</div>
        </div>
      </div>
    </details>
  );
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Data-driven rows. Omit to compose `<Accordion.Item>` children manually. */
  items?: AccordionItemData[];
  /** `sep` adds gaps between items; `flush` drops side borders. */
  variant?: 'default' | 'sep' | 'flush';
  children?: ReactNode;
}

/**
 * Disclosure accordion — native `<details>` rows, data-driven or composed via `Accordion.Item`.
 *
 * Keyboard: every header is a Tab stop; Enter / Space toggle it (native `<summary>`).
 * With focus on a header, Up / Down move to the previous / next header, wrapping,
 * and Home / End go to the first / last. Closed content cannot be reached with Tab.
 */
function AccordionRoot({
  items,
  variant = 'default',
  className = '',
  children,
  onKeyDown,
  ...rest
}: AccordionProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const headers = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        ':scope > .cd-accordion__item > .cd-accordion__trigger',
      ),
    );
    // Only from a header: arrow keys inside the content keep their own meaning.
    if (headers.includes(event.target as HTMLElement)) moveFocus(event, headers);
  };

  return (
    <div
      className={cn(
        'cd-accordion',
        variant !== 'default' && `cd-accordion--${variant}`,
        className,
      )}
      {...rest}
      onKeyDown={handleKeyDown}
    >
      {items
        ? items.map((item, i) => (
            <AccordionItem
              key={i}
              title={item.title}
              icon={item.icon}
              open={item.defaultOpen}
            >
              {item.content}
            </AccordionItem>
          ))
        : children}
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
