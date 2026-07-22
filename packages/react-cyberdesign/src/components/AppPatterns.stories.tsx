import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import { Chip, ChipRow } from './Chip';
import { StatusDot } from './StatusDot';
import { StatusPill } from './StatusPill';
import { Feed, FeedItem } from './FeedItem';
import { BottomNav } from './BottomNav';
import { StatusBar } from './StatusBar';
import { Chat } from './Chat';
import { HBar } from './HBar';
import { Clock } from './Clock';
import { Transport } from './Transport';
import { GlowCard } from './GlowCard';
import { Badge } from './Badge';
import { Stat, StatGrid } from './Stat';

/**
 * Patterns lifted from a civic-intel-style dashboard app and an AI-shell/REPL-style app.
 * Compose these with existing primitives for app shells.
 */
const meta = {
  title: 'App Patterns/Overview',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const DashboardSlice: Story = {
  name: 'dashboard slice',
  render: () => {
    const [filter, setFilter] = useState('all');
    const [tab, setTab] = useState('feed');
    const [selected, setSelected] = useState('1');

    return (
      <div
        style={{
          width: 360,
          border: '1px solid var(--cd-border)',
          background: 'var(--cd-bg)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 520,
        }}
      >
        <SectionHeader
          title="Intel feed"
          actions={
            <>
              <StatusDot status="live">SYS.ACTIVE</StatusDot>
              <Clock showDate={false} />
            </>
          }
        />
        <div style={{ padding: 8 }}>
          <ChipRow>
            {['all', 'crime', 'fire', 'weather'].map((id) => (
              <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>
                {id}
              </Chip>
            ))}
            <Chip active>NEAR</Chip>
            <Chip>TOP</Chip>
          </ChipRow>
        </div>
        <div style={{ padding: '0 8px 8px', flex: 1, overflow: 'auto' }}>
          <Feed>
            <FeedItem
              selected={selected === '1'}
              onClick={() => setSelected('1')}
              badge={<Badge color="red">CRIME</Badge>}
              time="2m"
              title="Burglary report — 4th & Harbor"
              subtitle="Sector 4 · significance 7"
            />
            <FeedItem
              selected={selected === '2'}
              onClick={() => setSelected('2')}
              badge={<Badge color="amber">FIRE</Badge>}
              time="14m"
              title="Vegetation fire contained"
              subtitle="Sector 7 · 2 units cleared"
            />
            <FeedItem
              selected={selected === '3'}
              onClick={() => setSelected('3')}
              badge={<Badge color="blue">WX</Badge>}
              time="1h"
              title="Coastal wind advisory"
              subtitle="Ports · 22 kn gusts"
            />
          </Feed>
        </div>
        <SectionHeader title="Metrics" />
        <div style={{ padding: 8 }}>
          <StatGrid>
            <Stat label="Today" value={142} variant="accent" />
            <Stat label="7 day" value={891} />
          </StatGrid>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <HBar label="Crime" value={72} display={48} />
            <HBar label="Fire" value={40} display={12} color="var(--cd-neon-amber)" />
            <HBar label="Transit" value={55} display={31} color="var(--cd-neon-green)" />
          </div>
        </div>
        <div style={{ padding: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <StatusPill variant="active">Active</StatusPill>
          <StatusPill variant="developing">Developing</StatusPill>
          <StatusPill variant="critical">SEV 4 · Critical</StatusPill>
          <StatusPill variant="resolved">Resolved</StatusPill>
        </div>
        <BottomNav
          value={tab}
          onValueChange={setTab}
          items={[
            { id: 'map', label: 'Map', icon: '◎' },
            { id: 'feed', label: 'Feed', icon: '▤', badge: 12 },
            { id: 'stats', label: 'Stats', icon: '▥' },
            { id: 'time', label: 'Time', icon: '▸' },
          ]}
        />
      </div>
    );
  },
};

export const AiShellSlice: Story = {
  name: 'AI-shell slice',
  render: () => {
    const [playing, setPlaying] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
      { role: 'system' as const, content: 'session ready · corpus indexed' },
      { role: 'user' as const, content: 'add a melody' },
      {
        role: 'assistant' as const,
        content: 'note("c3 e3 g3").s("sawtooth").room(0.4)',
      },
    ]);

    return (
      <div
        style={{
          width: 520,
          border: '1px solid var(--cd-border)',
          background: 'var(--cd-bg)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 420,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 10px',
            borderBottom: '1px solid var(--cd-border-dim)',
          }}
        >
          <Transport
            playing={playing}
            onPlay={() => setPlaying(true)}
            onStop={() => setPlaying(false)}
          />
          <StatusDot status={playing ? 'live' : 'paused'}>
            {playing ? 'Live' : 'Paused'}
          </StatusDot>
          <div style={{ marginLeft: 'auto' }}>
            <Clock />
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Chat
            style={{ width: 240, border: 'none', borderRight: '1px solid var(--cd-border-dim)' }}
            title="AI"
            messages={messages}
            prompts={[
              { label: '+ melody', value: 'add a melody' },
              { label: '+ drums', value: 'add drums' },
              { label: 'darker', value: 'make it darker' },
            ]}
            value={input}
            onValueChange={setInput}
            onPrompt={(v) => setInput(v)}
            onSubmit={(v) => {
              setMessages((m) => [
                ...m,
                { role: 'user', content: v },
                { role: 'assistant', content: `// pattern for: ${v}` },
              ]);
              setInput('');
            }}
          />
          <GlowCard
            color="cyan"
            style={{ flex: 1, margin: 10, padding: 12, minHeight: 200 }}
          >
            <div style={{ fontSize: 11, color: 'var(--cd-text-muted)', marginBottom: 8 }}>
              EDITOR
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: 12,
                color: 'var(--cd-accent)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`s("bd sd hh*4")\n  .bank("RolandTR909")\n  .gain(0.8)`}
            </pre>
          </GlowCard>
        </div>
        <StatusBar
          leading={<StatusDot status={playing ? 'live' : 'idle'} orbOnly />}
          message={playing ? 'evaluating pattern · 120 bpm' : 'ready'}
          meta={<span>untitled.strudel</span>}
        />
      </div>
    );
  },
};
