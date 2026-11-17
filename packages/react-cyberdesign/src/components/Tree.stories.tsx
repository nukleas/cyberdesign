import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tree } from './Tree';
import type { TreeNode } from './Tree';

const files: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    meta: 3,
    children: [
      {
        id: 'src/components',
        label: 'components',
        children: [
          { id: 'src/components/Tree.tsx', label: 'Tree.tsx', meta: 'M' },
          { id: 'src/components/Tabs.tsx', label: 'Tabs.tsx' },
        ],
      },
      { id: 'src/lib', label: 'lib', children: [{ id: 'src/lib/cn.ts', label: 'cn.ts' }] },
      { id: 'src/index.ts', label: 'index.ts' },
    ],
  },
  { id: 'assets', label: 'assets', children: [] },
  { id: 'package.json', label: 'package.json' },
  { id: '.lock', label: '.lock', disabled: true },
];

const meta = {
  title: 'Navigation/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    emptyLabel: { table: { category: 'Content' } },
    loadingLabel: { table: { category: 'Content' } },
    nodes: { table: { category: 'Content' } },
    selected: { table: { category: 'State' } },
    expanded: { table: { category: 'State' } },
    editing: { table: { category: 'State' } },
  },
  args: {
    nodes: files,
    'aria-label': 'Project files',
    style: { width: 280 },
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click or use the arrow keys. Right opens a branch, Left closes it or moves to the parent. */
export const Default: Story = {
  args: {
    defaultExpanded: ['src', 'src/components'],
    defaultSelected: 'src/components/Tree.tsx',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    defaultExpanded: ['src'],
    nodes: files.map((node) => ({ ...node, icon: node.children ? '⬡' : '◉' })),
  },
};

/** Children are fetched when a branch first opens; a "Loading…" row shows meanwhile. */
export const LazyLoading: Story = {
  render: (args) => {
    const [nodes, setNodes] = useState<TreeNode[]>([
      { id: 'cluster-a', label: 'Cluster A', branch: true },
      { id: 'cluster-b', label: 'Cluster B', branch: true },
    ]);
    return (
      <Tree
        {...args}
        nodes={nodes}
        onExpandedChange={(_, opened) => {
          if (opened.children) return;
          setTimeout(() => {
            const children = [1, 2, 3].map((n) => ({ id: `${opened.id}/node-0${n}`, label: `node-0${n}` }));
            setNodes((current) => current.map((node) => (node.id === opened.id ? { ...node, children } : node)));
          }, 800);
        }}
      />
    );
  },
};

/** Press F2 on a row to rename it. Enter or clicking away commits; Escape cancels. */
export const Renaming: Story = {
  render: (args) => {
    const [nodes, setNodes] = useState<TreeNode[]>([
      { id: 'a', label: 'notes.md' },
      { id: 'b', label: 'draft.md' },
      { id: 'c', label: 'archive', children: [{ id: 'd', label: 'old.md' }] },
    ]);
    const [editing, setEditing] = useState<string | null>('b');
    const rename = (items: TreeNode[], id: string, label: string): TreeNode[] =>
      items.map((node) =>
        node.id === id ? { ...node, label } : { ...node, children: node.children && rename(node.children, id, label) },
      );
    return (
      <Tree
        {...args}
        nodes={nodes}
        defaultExpanded={['c']}
        editing={editing}
        onEditStart={(node) => setEditing(node.id)}
        onEditCommit={(node, value) => {
          setNodes((current) => rename(current, node.id, value));
          setEditing(null);
        }}
        onEditCancel={() => setEditing(null)}
      />
    );
  },
};
