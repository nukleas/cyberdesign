import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from './Chat';

const meta = {
  title: 'App Patterns/Chat',
  component: Chat,
  tags: ['autodocs'],
} satisfies Meta<typeof Chat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([
      { role: 'system' as const, content: 'session ready' },
      { role: 'user' as const, content: 'add drums' },
      { role: 'assistant' as const, content: 's("bd sd hh*4").bank("RolandTR909")' },
    ]);
    return (
      <Chat
        style={{ width: 300, height: 380 }}
        title="AI"
        messages={messages}
        value={value}
        onValueChange={setValue}
        prompts={[
          { label: '+ melody', value: 'add a melody' },
          { label: '+ drums', value: 'add drums' },
          { label: 'darker', value: 'make it darker' },
        ]}
        onPrompt={setValue}
        onSubmit={(v) => {
          setMessages((m) => [...m, { role: 'user', content: v }, { role: 'assistant', content: `// ${v}` }]);
          setValue('');
        }}
      />
    );
  },
};
