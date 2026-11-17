import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { Command } from './Command';
import { Combobox } from './Combobox';

/**
 * Command palette list with ranked fuzzy matching.
 *
 * With an empty query every item is listed in its original order. With a query,
 * items are filtered to matches and ordered best first:
 *
 * | Tier | Rule | "save" finds |
 * | --- | --- | --- |
 * | exact | `label` equals the query | Save |
 * | prefix | `label` starts with the query (shorter labels first) | Save as… |
 * | substring | `label` contains the query (earlier, then shorter, first) | Autosave |
 * | secondary | `keywords` or `value` contains the query | Write to disk |
 * | subsequence | the query's letters appear in order in `label` | Show waveform |
 *
 * Matching is case-insensitive. When `label` is not a string, `value` is the
 * primary text instead. Group headings stay; groups are ordered by their best
 * match, so the first row is always the best match overall — it is highlighted
 * and Enter runs it.
 *
 * Keyboard — focus stays in the input, which is a `role="combobox"` naming the
 * highlighted row through `aria-activedescendant`; rows are not Tab stops:
 *
 * | Key | Action |
 * | --- | --- |
 * | Type | Filter and rank; the best match is highlighted |
 * | ArrowDown / ArrowUp | Next / previous row (disabled rows are skipped) |
 * | PageDown / PageUp | Move one screenful |
 * | Home / End | First / last row (Shift+Home / End still select text) |
 * | Enter | Run the highlighted row |
 *
 * The same matcher is exported as `fuzzyRank(items, query, text, secondary?)`
 * and `fuzzyScore(query, text, secondary?)` for ranking your own lists.
 */
const meta = {
  title: 'Overlay/Command',
  component: Command,
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  args: {
    items: [
      { value: 'new', label: 'New node', group: 'Actions', kbd: '⌘N' },
      { value: 'deploy', label: 'Deploy fleet', group: 'Actions', kbd: '⌘D' },
      { value: 'settings', label: 'Open settings', group: 'Navigation', kbd: '⌘,' },
      { value: 'docs', label: 'Documentation', group: 'Navigation' },
      { value: 'purge', label: 'Purge cache', group: 'Navigation', disabled: true },
      { value: 'logs', label: 'View logs', group: 'Navigation' },
    ],
  },
};

/**
 * Listed weakest match first, so typing **save** visibly reorders the list:
 * Save (exact), Save as… then Save file (prefix, shorter first), Autosave
 * (substring), Write to disk (keyword), Show waveform (subsequence). The View group moves below File
 * because its best match is weaker. Try **sf** for a subsequence-only match.
 */
export const Ranked: Story = {
  args: {
    items: [
      { value: 'waveform', label: 'Show waveform', group: 'View' },
      { value: 'stage', label: 'Stage mode', group: 'View', kbd: '⌘⇧F' },
      { value: 'write', label: 'Write to disk', keywords: 'save flush', group: 'File' },
      { value: 'auto', label: 'Autosave', group: 'File' },
      { value: 'file', label: 'Save file', group: 'File' },
      { value: 'as', label: 'Save as…', group: 'File', kbd: '⌘⇧S' },
      { value: 'now', label: 'Save', group: 'File', kbd: '⌘S' },
      { value: 'open', label: 'Open file…', group: 'File', kbd: '⌘O' },
    ],
  },
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox'), 'save');
  },
};

/** `onSelect` receives the row that Enter (or a click) ran. */
export const RunsCommand: Story = {
  args: {
    items: [
      { value: 'new', label: 'New node' },
      { value: 'deploy', label: 'Deploy fleet' },
      { value: 'purge', label: 'Purge cache', disabled: true },
      { value: 'logs', label: 'View logs' },
    ],
  },
  render: (args) => {
    const [last, setLast] = useState('none');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Command {...args} onSelect={(item) => setLast(item.value)} />
        <output>Last run: {last}</output>
      </div>
    );
  },
};

export const ComboboxDemo: Story = {
  args: { items: [] },
  render: () => (
    <Combobox
      options={[
        { value: 'orange', label: 'Orange theme' },
        { value: 'cyan', label: 'Cyan theme' },
        { value: 'green', label: 'Green theme' },
        { value: 'steel', label: 'Steel theme' },
      ]}
      placeholder="Pick a theme…"
      aria-label="Theme"
    />
  ),
};
