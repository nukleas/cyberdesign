import type { ReactNode } from 'react';
import { Table } from './Table';
import { Empty } from './Empty';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  /** Right-align numeric cells. */
  numeric?: boolean;
  /**
   * Makes the column sortable: its header becomes a button. `'asc'` / `'desc'`
   * are the current direction; `true` is sortable but not the sorted column.
   * The table does not sort `data` itself.
   */
  sort?: boolean | 'asc' | 'desc';
  /** The column's sort button was pressed. */
  onSort?: () => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Unique key for each row. */
  getRowId?: (row: T, index: number) => string | number;
  compact?: boolean;
  bordered?: boolean;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  className?: string;
  /** Accessible name of the table. */
  'aria-label'?: string;
}

/** Declarative data table built on {@link Table}. */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  compact,
  bordered,
  emptyTitle = 'No rows',
  emptyDescription = 'There is nothing to display yet.',
  className,
  'aria-label': ariaLabel,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <Empty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table
      compact={compact}
      bordered={bordered}
      scroll
      className={className}
      aria-label={ariaLabel}
      wrapProps={{ 'aria-label': ariaLabel }}
    >
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.HeaderCell key={col.key} sort={col.sort} onSort={col.onSort}>
              {col.header}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((row, i) => (
          <Table.Row key={getRowId?.(row, i) ?? i}>
            {columns.map((col) => (
              <Table.Cell key={col.key} numeric={col.numeric}>
                {col.cell(row, i)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
