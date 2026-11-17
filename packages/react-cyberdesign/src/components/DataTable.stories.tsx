import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge } from './Badge';

/**
 * Declarative data table built on `Table`.
 *
 * ### Keyboard
 * A column with `sort` gets a header button: Tab focuses it, Enter / Space
 * call the column's `onSort`, and the header cell carries `aria-sort`. The
 * table does not sort `data` itself. When the table is wider than its
 * container the scroll wrapper is a Tab stop and Left / Right scroll it.
 */
const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable
      bordered
      data={[
        { city: 'Santa Ana', n: 48 },
        { city: 'Irvine', n: 12 },
      ]}
      columns={[
        { key: 'city', header: 'City', cell: (r) => r.city },
        { key: 'n', header: 'Count', numeric: true, cell: (r) => r.n },
        {
          key: 'tag',
          header: 'Tag',
          cell: (r) => <Badge color={r.n > 20 ? 'red' : 'green'}>{r.n > 20 ? 'hot' : 'ok'}</Badge>,
        },
      ]}
    />
  ),
};

const CITIES = [
  { city: 'Santa Ana', n: 48 },
  { city: 'Irvine', n: 12 },
  { city: 'Anaheim', n: 31 },
];

/** Sort by pressing a header button, with the mouse or Enter / Space. */
export const Sortable: Story = {
  args: { columns: [], data: [] },
  render: () => {
    const [dir, setDir] = useState<'asc' | 'desc'>('asc');
    const data = [...CITIES].sort((a, b) => (dir === 'asc' ? a.n - b.n : b.n - a.n));
    return (
      <DataTable
        bordered
        aria-label="Events by city"
        data={data}
        getRowId={(r) => r.city}
        columns={[
          { key: 'city', header: 'City', cell: (r) => r.city },
          {
            key: 'n',
            header: 'Count',
            numeric: true,
            sort: dir,
            onSort: () => setDir((d) => (d === 'asc' ? 'desc' : 'asc')),
            cell: (r) => r.n,
          },
        ]}
      />
    );
  },
};
