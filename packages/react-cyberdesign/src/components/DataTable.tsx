import type { ReactNode } from 'react';
import { Table } from './Table';
import { Empty } from './Empty';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  /** Right-align numeric cells. */
  numeric?: boolean;
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
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <Empty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table compact={compact} bordered={bordered} scroll className={className}>
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.HeaderCell key={col.key}>{col.header}</Table.HeaderCell>
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
