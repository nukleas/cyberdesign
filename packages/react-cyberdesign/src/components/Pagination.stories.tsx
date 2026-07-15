import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { page: 1, pageCount: 12 },
  render: () => {
    const [page, setPage] = useState(3);
    return <Pagination page={page} pageCount={12} onPageChange={setPage} showInfo />;
  },
};

export const Compact: Story = {
  args: { page: 1, pageCount: 5 },
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageCount={5} onPageChange={setPage} size="sm" />;
  },
};
