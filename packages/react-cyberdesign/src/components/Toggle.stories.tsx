import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import { ToggleGroup } from './ToggleGroup';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';

/**
 * Two-state toggle: a native `<button>` with `aria-pressed`.
 *
 * | Key | Action |
 * | --- | --- |
 * | Tab | Focus the toggle |
 * | Space / Enter | Press / release |
 */
const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Bold', defaultPressed: true },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToggleGroup
        items={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
        defaultValue="week"
      />
      <ButtonGroup>
        <Button size="sm">Cut</Button>
        <Button size="sm">Copy</Button>
        <Button size="sm" variant="primary">
          Paste
        </Button>
      </ButtonGroup>
    </div>
  ),
};
