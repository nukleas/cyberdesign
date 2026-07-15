import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    backgrounds: {
      default: 'cyber',
      values: [
        { name: 'cyber', value: '#05060a' },
        { name: 'panel', value: '#0c0e14' },
      ],
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'cyberdesign accent theme',
      defaultValue: 'orange',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'orange', title: 'Orange' },
          { value: 'cyan', title: 'Cyan' },
          { value: 'green', title: 'Green' },
          { value: 'red', title: 'Red' },
          { value: 'steel', title: 'Steel' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'orange';
      return (
        // @ts-expect-error decorator returns JSX; Storybook runtime handles this
        <div
          className={`theme-${theme}`}
          style={{
            fontFamily: 'var(--cd-font-mono)',
            color: 'var(--cd-text)',
            background: 'var(--cd-bg)',
            padding: 24,
            minWidth: 280,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
