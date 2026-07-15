import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge } from './Badge';

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
