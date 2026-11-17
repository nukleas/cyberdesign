import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from './Menubar';

const keys = `
A WAI-ARIA menubar. The whole bar is one Tab stop.

| Key | On the bar |
| --- | --- |
| ArrowLeft / ArrowRight | Previous / next menu, looping; if a menu is open the neighbour opens |
| Home / End | First / last menu |
| A letter | Next menu whose label starts with it |
| ArrowDown / Enter / Space | Open the menu, focus the first item |
| ArrowUp | Open the menu, focus the last item |

| Key | In a menu |
| --- | --- |
| ArrowDown / ArrowUp | Next / previous enabled item, looping |
| Home / End | First / last enabled item |
| A letter | Next item whose label starts with it |
| ArrowLeft / ArrowRight | Open the previous / next menu, focus on its label in the bar |
| Enter / Space | Choose the item and return focus to the bar |
| Escape | Close and return focus to the bar |
| Tab | Close and move on to the next Tab stop |
`;

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: keys } } },
} satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Application',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New' },
          { label: 'Open…' },
          { label: 'Save' },
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Undo' },
          { label: 'Redo' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Toggle AI' },
          { label: 'Fullscreen viz' },
        ],
      },
    ],
  },
};

/** The bar between two buttons, with a disabled item: Tab to it and drive it from the keyboard. */
export const Keyboard: Story = {
  args: { menus: [] },
  render: () => {
    const [last, setLast] = useState('nothing yet');
    const pick = (label: string) => () => setLast(label);
    return (
      <div style={{ paddingBottom: 160 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="button" className="cd-btn">Before</button>
          <Menubar
            aria-label="Application"
            menus={[
              {
                label: 'File',
                items: [
                  { label: 'New', onSelect: pick('New') },
                  { label: 'Open…', onSelect: pick('Open') },
                  { label: 'Save', disabled: true },
                  { label: 'Share', onSelect: pick('Share') },
                ],
              },
              {
                label: 'Edit',
                items: [
                  { label: 'Undo', onSelect: pick('Undo') },
                  { label: 'Redo', onSelect: pick('Redo') },
                ],
              },
              {
                label: 'View',
                items: [
                  { label: 'Toggle AI', onSelect: pick('Toggle AI') },
                  { label: 'Fullscreen viz', onSelect: pick('Fullscreen viz') },
                ],
              },
            ]}
          />
          <button type="button" className="cd-btn">After</button>
        </div>
        <p data-testid="last" style={{ fontSize: 12 }}>Last chosen: {last}</p>
      </div>
    );
  },
};
