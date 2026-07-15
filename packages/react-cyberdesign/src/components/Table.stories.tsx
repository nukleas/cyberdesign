import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { DataTable } from './DataTable';
import { Badge } from './Badge';

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: () => (
    <Table bordered scroll style={{ minWidth: 420 }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Node</Table.HeaderCell>
          <Table.HeaderCell>Region</Table.HeaderCell>
          <Table.HeaderCell numeric>p99</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>edge-07</Table.Cell>
          <Table.Cell>west</Table.Cell>
          <Table.Cell numeric>42ms</Table.Cell>
          <Table.Cell status="ok">nominal</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>edge-12</Table.Cell>
          <Table.Cell>east</Table.Cell>
          <Table.Cell numeric>180ms</Table.Cell>
          <Table.Cell status="warn">degraded</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>edge-03</Table.Cell>
          <Table.Cell>orbit</Table.Cell>
          <Table.Cell numeric>—</Table.Cell>
          <Table.Cell status="err">down</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

type Row = { id: string; city: string; count: number; level: string };

export const DataDriven: Story = {
  name: 'DataTable',
  render: () => (
    <DataTable<Row>
      compact
      bordered
      data={[
        { id: '1', city: 'Santa Ana', count: 48, level: 'high' },
        { id: '2', city: 'Irvine', count: 12, level: 'low' },
        { id: '3', city: 'Anaheim', count: 31, level: 'med' },
      ]}
      columns={[
        { key: 'city', header: 'City', cell: (r) => r.city },
        { key: 'count', header: 'Events', numeric: true, cell: (r) => r.count },
        {
          key: 'level',
          header: 'Level',
          cell: (r) => (
            <Badge color={r.level === 'high' ? 'red' : r.level === 'med' ? 'amber' : 'green'}>
              {r.level}
            </Badge>
          ),
        },
      ]}
    />
  ),
};
