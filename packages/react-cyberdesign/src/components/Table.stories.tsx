import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { DataTable } from './DataTable';
import { Badge } from './Badge';

/**
 * Cyber data table.
 *
 * ### Keyboard
 * | Key | Action |
 * | --- | --- |
 * | Tab | Each sortable column's header button; the scroll wrapper when the table overflows it |
 * | Enter / Space | Press the header button (`onSort`) |
 * | Left / Right | Scroll the focused wrapper |
 *
 * The header cell of a sortable column carries `aria-sort`.
 */
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

const NODES = [
  { node: 'edge-07', p99: 42 },
  { node: 'edge-12', p99: 180 },
  { node: 'edge-03', p99: 95 },
];

/** Sortable headers: `sort` renders a button, `onSort` reports a press. */
export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: 'node' | 'p99'; dir: 'asc' | 'desc' }>({
      key: 'node',
      dir: 'asc',
    });
    const press = (key: 'node' | 'p99') => () =>
      setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
    const rows = [...NODES].sort((a, b) => {
      const order = sort.key === 'node' ? a.node.localeCompare(b.node) : a.p99 - b.p99;
      return sort.dir === 'asc' ? order : -order;
    });
    return (
      <Table bordered aria-label="Nodes" style={{ minWidth: 320 }}>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell sort={sort.key === 'node' ? sort.dir : true} onSort={press('node')}>
              Node
            </Table.HeaderCell>
            <Table.HeaderCell
              numeric
              sort={sort.key === 'p99' ? sort.dir : true}
              onSort={press('p99')}
            >
              p99
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.node}>
              <Table.Cell>{row.node}</Table.Cell>
              <Table.Cell numeric>{row.p99}ms</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

/** Wider than its container: the scroll wrapper is a Tab stop and Left / Right scroll it. */
export const Scrolling: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <Table scroll wrapProps={{ 'aria-label': 'Nodes' }} style={{ minWidth: 520 }}>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Node</Table.HeaderCell>
            <Table.HeaderCell>Region</Table.HeaderCell>
            <Table.HeaderCell numeric>p99</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {NODES.map((row) => (
            <Table.Row key={row.node}>
              <Table.Cell>{row.node}</Table.Cell>
              <Table.Cell>west</Table.Cell>
              <Table.Cell numeric>{row.p99}ms</Table.Cell>
              <Table.Cell status="ok">nominal</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
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
