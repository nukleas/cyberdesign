import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chat, ChatMessage, ChatToolCall, type ChatMessageData } from './Chat';

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

const TOOL_TURN: ChatMessageData[] = [
  { role: 'user', content: 'why is the build red?' },
  {
    role: 'assistant',
    content: 'The bundle array points at a stylesheet that no longer exists. Checking where it moved.',
    toolCalls: [
      {
        id: 'call-1',
        name: 'read_file',
        status: 'success',
        summary: 'build.ts — 212 lines, bundle array registers 41 component stylesheets',
        durationMs: 38,
        input: { path: 'build.ts' },
        result: "import { readFileSync, writeFileSync } from 'node:fs';\n// … 210 more lines",
      },
      {
        id: 'call-2',
        name: 'run_command',
        status: 'error',
        summary: 'pnpm build exited with code 1',
        errorCategory: 'exit',
        durationMs: 4200,
        input: { command: 'pnpm build' },
        result: "error: ENOENT: no such file or directory, open 'src/css/components/chat.css'",
      },
      {
        id: 'call-3',
        name: 'search_files',
        status: 'pending',
        input: { query: 'chat.css' },
      },
    ],
  },
];

/** A turn's tool calls sit above its prose: one finished, one failed with its category chip, one still running. */
export const ToolCalls: Story = {
  render: () => <Chat style={{ width: 380, height: 420 }} title="AI" messages={TOOL_TURN} />,
};

/** Composing `ChatMessage` by hand: pass `ChatToolCall` rows to `toolCalls`. With no body yet, only the rows render. */
export const ToolCallsComposed: Story = {
  render: () => (
    <Chat style={{ width: 380, height: 320 }} title="AI">
      <ChatMessage role="user">find the missing stylesheet</ChatMessage>
      <ChatMessage
        role="assistant"
        toolCalls={
          <>
            <ChatToolCall
              name="search_files"
              status="success"
              summary="1 match in app-patterns.css"
              durationMs={112}
              input={{ query: 'cd-chat' }}
              result="packages/cyberdesign/src/css/components/app-patterns.css"
              open
            />
            <ChatToolCall name="read_file" status="pending" input="app-patterns.css" />
          </>
        }
      />
    </Chat>
  ),
};
