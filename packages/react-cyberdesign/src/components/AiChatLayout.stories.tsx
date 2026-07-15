import { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Chat,
  ChatAction,
  ChatActions,
  ChatMessage,
  type ChatMessageData,
} from './Chat';
import { PanelHeader } from './PanelHeader';
import { StatusDot } from './StatusDot';
import { StatusBar } from './StatusBar';
import { Transport } from './Transport';
import { Button } from './Button';
import { Kbd } from './Kbd';
import { Clock } from './Clock';
import { Tooltip } from './Tooltip';

/**
 * Full AI chat workspace — robostrudel-inspired layout with message hover actions,
 * code insert/run, composer tools, and a paired editor pane.
 */
const meta = {
  title: 'Examples/AI Chat Layout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composable AI chat shell: hover toolbars on messages, code fences with copy/insert/run, quick prompts, and an editor side panel.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Msg = ChatMessageData & {
  liked?: boolean;
  disliked?: boolean;
};

const SEED: Msg[] = [
  {
    id: '0',
    role: 'system',
    content: 'session ready · model cyber-1 · corpus indexed',
    time: '12:01:04',
  },
  {
    id: '1',
    role: 'user',
    content: 'add a techno groove with a rolling bassline',
    time: '12:01:12',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Here is a tight 128 BPM kit + bass stack. Hover the message or code block for actions — insert drops it into the editor, run evaluates.',
    code: `// techno groove
stack(
  s("bd*4, ~ sd ~ sd, hh*8").bank("RolandTR909").gain(0.75),
  note("<a1 c2 e2 g1>").s("sawtooth")
    .lpf(sine.range(200, 1200).slow(4))
    .room(0.3)
).cpm(128)`,
    codeLang: 'strudel',
    time: '12:01:14',
  },
  {
    id: '3',
    role: 'user',
    content: 'darker — more reverb, slower hats',
    time: '12:02:01',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Pulled hats to 1/2 rate and opened the room. Bass detuned slightly for grit.',
    code: `stack(
  s("bd*4, ~ sd ~ sd, hh*4").bank("RolandTR909").gain(0.7).room(0.55),
  note("<a1 c2 e2 g1>").s("sawtooth")
    .detune(8)
    .lpf(sine.range(180, 900).slow(6))
    .room(0.45)
).cpm(128)`,
    codeLang: 'strudel',
    time: '12:02:03',
  },
];

function MessageActions({
  msg,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  onInsert,
  onRun,
}: {
  msg: Msg;
  onCopy: () => void;
  onRegenerate: () => void;
  onLike: () => void;
  onDislike: () => void;
  onInsert?: () => void;
  onRun?: () => void;
}) {
  if (msg.role === 'system') return null;

  if (msg.role === 'user') {
    return (
      <ChatActions>
        <Tooltip tip="Edit">
          <ChatAction icon="✎" label="Edit" title="Edit message" />
        </Tooltip>
        <Tooltip tip="Copy">
          <ChatAction icon="⧉" label="Copy" title="Copy" onClick={onCopy} />
        </Tooltip>
        <Tooltip tip="Delete">
          <ChatAction icon="✕" label="Delete" title="Delete" danger />
        </Tooltip>
      </ChatActions>
    );
  }

  // assistant / error
  return (
    <ChatActions>
      {msg.code && onInsert && (
        <Tooltip tip="Insert into editor">
          <ChatAction icon="↧" label="Insert" title="Insert into editor" onClick={onInsert} />
        </Tooltip>
      )}
      {msg.code && onRun && (
        <Tooltip tip="Run pattern">
          <ChatAction icon="▶" label="Run" title="Run / play" onClick={onRun} />
        </Tooltip>
      )}
      <Tooltip tip="Copy">
        <ChatAction icon="⧉" label="Copy" title="Copy message" onClick={onCopy} />
      </Tooltip>
      <Tooltip tip="Regenerate">
        <ChatAction icon="↺" label="Regen" title="Regenerate" onClick={onRegenerate} />
      </Tooltip>
      <Tooltip tip="Good response">
        <ChatAction
          icon="▲"
          label="Up"
          title="Good response"
          active={msg.liked}
          onClick={onLike}
        />
      </Tooltip>
      <Tooltip tip="Bad response">
        <ChatAction
          icon="▼"
          label="Down"
          title="Bad response"
          active={msg.disliked}
          onClick={onDislike}
        />
      </Tooltip>
      <Tooltip tip="More">
        <ChatAction icon="···" label="More" title="More actions" />
      </Tooltip>
    </ChatActions>
  );
}

function AiChatWorkspace() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState('');
  const [playing, setPlaying] = useState(false);
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState('ready · hover a message for actions');
  const [editor, setEditor] = useState(
    SEED.find((m) => m.role === 'assistant' && m.code)?.code ?? '// empty',
  );
  const [attachOn, setAttachOn] = useState(false);
  const [model, setModel] = useState<'cyber-1' | 'cyber-fast'>('cyber-1');

  const flash = useCallback((msg: string) => {
    setStatus(msg);
  }, []);

  const insertCode = useCallback(
    (code: string) => {
      setEditor(code);
      flash('inserted pattern into editor');
    },
    [flash],
  );

  const runCode = useCallback(
    (code: string) => {
      setEditor(code);
      setPlaying(true);
      flash('evaluating pattern · 128 bpm');
    },
    [flash],
  );

  const send = useCallback(
    (text: string) => {
      const userMsg: Msg = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        time: new Date().toLocaleTimeString(undefined, { hour12: false }),
      };
      setMessages((m) => [...m, userMsg]);
      setInput('');
      setTyping(true);
      flash('model streaming…');
      window.setTimeout(() => {
        setTyping(false);
        const reply: Msg = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `Got it — tweaking for “${text.slice(0, 48)}${text.length > 48 ? '…' : ''}”.`,
          code: `// response to: ${text.slice(0, 40)}\ns("bd sd hh*4").bank("RolandTR909").room(0.3)`,
          codeLang: 'strudel',
          time: new Date().toLocaleTimeString(undefined, { hour12: false }),
        };
        setMessages((m) => [...m, reply]);
        flash('response complete');
      }, 1200);
    },
    [flash],
  );

  const prompts = useMemo(
    () => [
      { label: '+ melody', value: 'add a melody on top' },
      { label: '+ drums', value: 'add breakbeat drums' },
      { label: 'darker', value: 'make it darker and slower' },
      { label: '+ fx', value: 'add reverb and delay' },
      { label: 'faster', value: 'speed it up to 140' },
    ],
    [],
  );

  return (
    <div
      className="theme-orange"
      style={{
        minHeight: '100vh',
        background: 'var(--cd-bg)',
        color: 'var(--cd-text)',
        fontFamily: 'var(--cd-font-mono)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 12px',
          borderBottom: '1px solid var(--cd-border-dim)',
          background: 'color-mix(in srgb, var(--cd-bg-panel) 90%, transparent)',
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: '0.2em', color: 'var(--cd-accent)', fontSize: 12 }}>
          ROBOSTRUDEL
        </div>
        <Transport
          playing={playing}
          onPlay={() => {
            setPlaying(true);
            flash('live · 128 bpm');
          }}
          onStop={() => {
            setPlaying(false);
            flash('stopped');
          }}
        />
        <StatusDot status={playing ? 'live' : 'paused'}>
          {playing ? 'Live' : 'Paused'}
        </StatusDot>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--cd-text-dim)' }}>
            model <strong style={{ color: 'var(--cd-accent)' }}>{model}</strong>
          </span>
          <Clock />
        </div>
      </div>

      <div className="cd-ai-layout" style={{ flex: 1, minHeight: 0, border: 'none', borderRadius: 0 }}>
        {/* Chat rail */}
        <div className="cd-ai-layout__chat">
          <Chat
            title="AI"
            actions={
              <div style={{ display: 'flex', gap: 4 }}>
                <ChatAction
                  icon="＋"
                  label="New"
                  showLabel
                  title="New chat"
                  onClick={() => {
                    setMessages([
                      {
                        id: 'sys',
                        role: 'system',
                        content: 'new session',
                        time: new Date().toLocaleTimeString(undefined, { hour12: false }),
                      },
                    ]);
                    flash('new chat');
                  }}
                />
                <ChatAction
                  icon="☰"
                  label="History"
                  title="History"
                  onClick={() => flash('history (demo)')}
                />
              </div>
            }
            messages={messages}
            typing={typing}
            typingLabel="cyber-1 thinking"
            value={input}
            onValueChange={setInput}
            onSubmit={send}
            prompts={prompts}
            onPrompt={(v) => setInput(v)}
            placeholder="Describe a pattern…  (Enter to send)"
            disabled={typing}
            composerTools={
              <>
                <Tooltip tip="Attach file">
                  <ChatAction
                    icon="📎"
                    label="Attach"
                    active={attachOn}
                    onClick={() => setAttachOn((a) => !a)}
                    title="Attach"
                  />
                </Tooltip>
                <Tooltip tip="Voice input">
                  <ChatAction icon="◉" label="Mic" title="Voice input" />
                </Tooltip>
                <Tooltip tip="Switch model">
                  <ChatAction
                    icon="⬡"
                    label={model}
                    showLabel
                    title="Model"
                    onClick={() =>
                      setModel((m) => (m === 'cyber-1' ? 'cyber-fast' : 'cyber-1'))
                    }
                  />
                </Tooltip>
                <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--cd-text-dim)' }}>
                  <Kbd>↵</Kbd> send
                </span>
              </>
            }
            renderMessage={(raw) => {
              const msg = raw as Msg;
              const copyText = () => {
                const text =
                  typeof msg.content === 'string'
                    ? msg.content
                    : msg.code ?? '';
                void navigator.clipboard?.writeText(text);
                flash('copied to clipboard');
              };
              return (
                <ChatMessage
                  role={msg.role}
                  code={msg.code}
                  codeLang={msg.codeLang}
                  time={msg.time}
                  author={msg.author}
                  onCopyCode={() => flash('code copied')}
                  onInsertCode={insertCode}
                  onRunCode={runCode}
                  actions={
                    <MessageActions
                      msg={msg}
                      onCopy={copyText}
                      onRegenerate={() => flash('regenerating…')}
                      onLike={() => {
                        setMessages((list) =>
                          list.map((m) =>
                            m.id === msg.id
                              ? { ...m, liked: !m.liked, disliked: false }
                              : m,
                          ),
                        );
                      }}
                      onDislike={() => {
                        setMessages((list) =>
                          list.map((m) =>
                            m.id === msg.id
                              ? { ...m, disliked: !m.disliked, liked: false }
                              : m,
                          ),
                        );
                      }}
                      onInsert={msg.code ? () => insertCode(msg.code!) : undefined}
                      onRun={msg.code ? () => runCode(msg.code!) : undefined}
                    />
                  }
                >
                  {msg.content}
                </ChatMessage>
              );
            }}
          />
        </div>

        {/* Editor main */}
        <div className="cd-ai-layout__main">
          <div className="cd-ai-layout__editor">
            <PanelHeader
              actions={
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard?.writeText(editor);
                      flash('editor copied');
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setPlaying(true);
                      flash('evaluating editor buffer');
                    }}
                  >
                    ▶ Eval
                  </Button>
                </div>
              }
            >
              Editor · live buffer
            </PanelHeader>
            <div className="cd-ai-layout__editor-body">
              <span className="tok-cm">{`// hover assistant messages for Insert / Run / Copy / Regen\n// code blocks also expose header actions on hover\n\n`}</span>
              {editor}
            </div>
          </div>
          <StatusBar
            leading={<StatusDot status={playing ? 'live' : 'idle'} orbOnly />}
            message={status}
            meta={
              <>
                <span>{messages.filter((m) => m.role !== 'system').length} msgs</span>
                <span>{model}</span>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

export const Workspace: Story = {
  name: 'Full workspace',
  render: () => <AiChatWorkspace />,
};

export const PanelOnly: Story = {
  name: 'Chat panel only',
  parameters: { layout: 'centered' },
  render: () => {
    const [messages, setMessages] = useState<Msg[]>(SEED.slice(0, 3));
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);

    return (
      <div style={{ width: 360, height: 560 }}>
        <Chat
          title="AI"
          style={{ height: '100%' }}
          messages={messages}
          typing={typing}
          value={input}
          onValueChange={setInput}
          prompts={[
            { label: '+ melody', value: 'add a melody' },
            { label: 'darker', value: 'make it darker' },
          ]}
          onPrompt={setInput}
          onSubmit={(v) => {
            setMessages((m) => [
              ...m,
              { id: String(Date.now()), role: 'user', content: v, time: 'now' },
            ]);
            setInput('');
            setTyping(true);
            window.setTimeout(() => {
              setTyping(false);
              setMessages((m) => [
                ...m,
                {
                  id: String(Date.now() + 1),
                  role: 'assistant',
                  content: 'Updated pattern ready.',
                  code: `s("bd sd").bank("RolandTR909")`,
                  time: 'now',
                },
              ]);
            }, 900);
          }}
          composerTools={
            <>
              <ChatAction icon="📎" title="Attach" />
              <ChatAction icon="◉" title="Mic" />
              <ChatAction icon="⬡" label="cyber-1" showLabel title="Model" />
            </>
          }
          renderMessage={(msg) => (
            <ChatMessage
              role={msg.role}
              code={msg.code}
              codeLang={msg.codeLang}
              time={msg.time}
              onInsertCode={() => undefined}
              onRunCode={() => undefined}
              actions={
                msg.role === 'assistant' ? (
                  <ChatActions>
                    <ChatAction icon="↧" title="Insert" />
                    <ChatAction icon="▶" title="Run" />
                    <ChatAction icon="⧉" title="Copy" />
                    <ChatAction icon="↺" title="Regenerate" />
                    <ChatAction icon="▲" title="Good" />
                    <ChatAction icon="▼" title="Bad" />
                  </ChatActions>
                ) : msg.role === 'user' ? (
                  <ChatActions>
                    <ChatAction icon="✎" title="Edit" />
                    <ChatAction icon="⧉" title="Copy" />
                  </ChatActions>
                ) : undefined
              }
            >
              {msg.content}
            </ChatMessage>
          )}
        />
      </div>
    );
  },
};
