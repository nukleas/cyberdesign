import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Tighter padding and smaller type. */
  compact?: boolean;
  /** Draw cell borders. */
  bordered?: boolean;
  /** Wrap the table in a horizontally-scrollable `cd-table-wrap` container. */
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

  const { className: wrapClassName = '', ...wrapRest } = wrapProps ?? {};
  return (
    <div className={cn('cd-table-wrap', wrapClassName)} {...wrapRest}>
      {table}
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
  /** Mark column sortable; `'asc'`/`'desc'` show a direction arrow (sets `data-sort`). */
  sort?: boolean | 'asc' | 'desc';
  children?: ReactNode;
}

/** `<th>` header cell — supports numeric alignment and a sortable `data-sort` indicator. */
function TableHeaderCell({
  numeric = false,
  sort,
  className = '',
  children,
  ...rest
}: TableHeaderCellProps) {
  const dataSort = sort === true ? '' : sort || undefined;
  return (
    <th
      className={cn(numeric && 'cd-table__num', className)}
      data-sort={dataSort}
      {...rest}
    >
      {children}
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
