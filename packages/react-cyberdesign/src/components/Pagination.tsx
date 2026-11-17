import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Fired with the target page when a control is activated. */
  onPageChange?: (page: number) => void;
  /** How many sibling pages to show on each side of the current page. */
  siblingCount?: number;
  /** Size variant. */
  size?: 'default' | 'sm' | 'lg';
  /** Collapse gaps so items share borders. */
  compact?: boolean;
  /** Show "Page X of Y" info text after the controls. */
  showInfo?: boolean;
  /** Prev button label. */
  prevLabel?: React.ReactNode;
  /** Next button label. */
  nextLabel?: React.ReactNode;
}

/** Build the windowed list of page numbers with `'…'` gaps. */
function buildPages(page: number, pageCount: number, siblingCount: number): Array<number | '…'> {
  const total = pageCount;
  // pages always shown: first, last, current ± siblingCount
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(total - 1, page + siblingCount);
  const pages: Array<number | '…'> = [1];
  if (left > 2) pages.push('…');
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push('…');
  if (total > 1) pages.push(total);
  return pages;
}

/**
 * Page navigation — windowed page list with prev/next, ellipsis and optional info.
 *
 * Keyboard: every control is a native button — Tab / Shift+Tab move between them
 * and Enter / Space activate. The current page carries `aria-current="page"`.
 * Prev / next stay focusable at the first / last page (`aria-disabled`), so
 * focus is not dropped when you page to either end.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  size = 'default',
  compact = false,
  showInfo = false,
  prevLabel = '‹ Prev',
  nextLabel = 'Next ›',
  className = '',
  ...rest
}: PaginationProps) {
  const go = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return;
    onPageChange?.(p);
  };

  return (
    <nav
      className={cn(
        'cd-pagination',
        size !== 'default' && `cd-pagination--${size}`,
        compact && 'cd-pagination--compact',
        className,
      )}
      aria-label="Pagination"
      {...rest}
    >
      <button
        type="button"
        className="cd-pagination__prev cd-pagination__item"
        aria-label="Previous page"
        aria-disabled={page <= 1 || undefined}
        onClick={() => go(page - 1)}
      >
        {prevLabel}
      </button>
      {buildPages(page, pageCount, siblingCount).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="cd-pagination__ellipsis">
            ···
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn('cd-pagination__item', p === page && 'is-active')}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="cd-pagination__next cd-pagination__item"
        aria-label="Next page"
        aria-disabled={page >= pageCount || undefined}
        onClick={() => go(page + 1)}
      >
        {nextLabel}
      </button>
      {showInfo && (
        <span className="cd-pagination__info">
          Page {page} of {pageCount}
        </span>
      )}
    </nav>
  );
}
