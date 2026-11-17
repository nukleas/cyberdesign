import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from './NavigationMenu';

const keys = `
A \`nav\` landmark holding plain links and buttons. It is deliberately not a \`menu\`: there are
no flyouts, so there are no arrow keys to learn.

| Key | Action |
| --- | --- |
| Tab / Shift+Tab | Next / previous link |
| Enter | Follow the link or press the button |
| Space | Press the button (items without \`href\`) |

The active item carries \`aria-current="page"\`.
`;

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: keys } } },
} satisfies Meta<typeof NavigationMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Primary',
    items: [
      { label: 'Dashboard', active: true },
      { label: 'Search', href: '#' },
      { label: 'Dossiers', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
};
