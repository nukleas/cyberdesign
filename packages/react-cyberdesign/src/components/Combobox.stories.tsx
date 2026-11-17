import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';

/**
 * Searchable select. Typing filters and ranks the options with the same
 * `fuzzyRank` matcher as `Command`. Name it with `aria-label`,
 * `aria-labelledby`, or `id` + `<label htmlFor>`.
 *
 * Keyboard — focus stays in the input (`role="combobox"`), which names the
 * highlighted option through `aria-activedescendant`:
 *
 * | Key | Action |
 * | --- | --- |
 * | ArrowDown / ArrowUp | Open the list on the selected option (else the first / last); then next / previous option |
 * | Type | Open, filter and rank; the best match is highlighted |
 * | PageDown / PageUp | Move one screenful |
 * | Home / End | First / last option while the list is open |
 * | Enter | Select the highlighted option and close |
 * | Escape | Close the list; pressed again, clear the selection |
 * | Tab | Move on; the list closes without selecting |
 *
 * Disabled options are skipped.
 */
const meta = {
  title: 'Form/Combobox',
  component: Combobox,
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Pick theme…',
    'aria-label': 'Theme',
    options: [
      { value: 'orange', label: 'Orange' },
      { value: 'cyan', label: 'Cyan' },
      { value: 'green', label: 'Green' },
      { value: 'red', label: 'Red', disabled: true },
      { value: 'steel', label: 'Steel' },
    ],
  },
};
