import { useRef } from 'react';
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useScrollTabStop } from '../lib/useScrollTabStop';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Tighter padding and smaller type. */
  compact?: boolean;
  /** Draw cell borders. */
  bordered?: boolean;
  /**
   * Wrap the table in a horizontally-scrollable `cd-table-wrap` container. While
   * the table overflows it and holds nothing focusable, the container is a Tab
   * stop so the arrow keys scroll it; name it through `wrapProps`.
   */
  scroll?: boolean;
  /** Props forwarded to the wrapping `cd-table-wrap` div when `scroll` is set. */
  wrapProps?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
}

/** Cyber data table — accent uppercase headers, status dots, numeric cells. Compose with Table.Head/Body/Row/HeaderCell/Cell. */
export function Table({
  compact = false,
  bordered = false,
  scroll = false,
  wrapProps,
  className = '',
  children,
  ...rest
}: TableProps) {
  const table = (
    <table
      className={cn(
        'cd-table',
        compact && 'cd-table--compact',
        bordered && 'cd-table--bordered',
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  );

  if (!scroll) return table;

  return <TableWrap {...wrapProps}>{table}</TableWrap>;
}

function TableWrap({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const tabStop = useScrollTabStop(ref);
  return (
    <div
      ref={ref}
      className={cn('cd-table-wrap', className)}
      {...(tabStop && { tabIndex: 0, role: 'group' })}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/** `<thead>` group for the table header row(s). */
function TableHead({ children, ...rest }: TableHeadProps) {
  return <thead {...rest}>{children}</thead>;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/** `<tbody>` group for the table data rows. */
function TableBody({ children, ...rest }: TableBodyProps) {
  return <tbody {...rest}>{children}</tbody>;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

/** `<tr>` table row. */
function TableRow({ children, ...rest }: TableRowProps) {
  return <tr {...rest}>{children}</tr>;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligned tabular-numeric header cell (`cd-table__num`). */
  numeric?: boolean;
  /**
   * Makes the column sortable: the header content becomes a button (Tab, then
   * Enter / Space) and the cell carries `aria-sort`. `'asc'` / `'desc'` are the
   * current direction; `true` is sortable but not the sorted column.
   */
  sort?: boolean | 'asc' | 'desc';
  /** The sort button was pressed. Change the sort order and pass the new `sort`. */
  onSort?: () => void;
  children?: ReactNode;
}

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

/** `<th>` header cell — supports numeric alignment and a keyboard-operable sort button. */
function TableHeaderCell({
  numeric = false,
  sort,
  onSort,
  className = '',
  children,
  ...rest
}: TableHeaderCellProps) {
  return (
    <th
      className={cn(numeric && 'cd-table__num', className)}
      aria-sort={sort ? (sort === true ? 'none' : ARIA_SORT[sort]) : undefined}
      {...rest}
    >
      {sort ? (
        <button type="button" className="cd-table__sort" onClick={onSort}>
          {children}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligned tabular-numeric, accent-colored cell (`cd-table__num`). */
  numeric?: boolean;
  /** Status dot prefix (sets `data-status`). */
  status?: 'ok' | 'warn' | 'err' | 'idle';
  children?: ReactNode;
}

/** `<td>` data cell — supports numeric alignment and a leading status dot. */
function TableCell({
  numeric = false,
  status,
  className = '',
  children,
  ...rest
}: TableCellProps) {
  return (
    <td
      className={cn(numeric && 'cd-table__num', className)}
      data-status={status}
      {...rest}
    >
      {children}
    </td>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
