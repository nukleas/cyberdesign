import { Tabs } from 'cyberdesign';

const Frame = ({ children, max = 560 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const para = (text: string) => (
  <p style={{ fontSize: 11, color: 'var(--cd-text-secondary)', lineHeight: 1.6, margin: 0 }}>{text}</p>
);

export const Underline = () => (
  <Frame>
    <Tabs
      items={[
        { label: 'Overview', content: para('Overview panel — summary metrics, status indicators, quick actions.') },
        { label: 'Events', badge: 12, content: para('Events panel — filtered event stream with severity and timestamp.') },
        { label: 'Raw Logs', content: para('2026-06-17 04:12:03 INFO auth token rotated · 04:11:58 WARN rate limit 47/60') },
        { label: 'Config', content: para('Config panel — editable settings, API keys, webhook endpoints.') },
      ]}
    />
  </Frame>
);

export const Pills = () => (
  <Frame max={360}>
    <Tabs variant="pills" hidePanels items={[{ label: 'All' }, { label: 'Active' }, { label: 'Archived' }]} />
  </Frame>
);

export const Vertical = () => (
  <Frame max={420}>
    <Tabs
      variant="vertical"
      items={[
        { label: 'Network', content: para('Network diagnostics panel.') },
        { label: 'System', content: para('System health panel.') },
        { label: 'Auth', content: para('Authentication logs panel.') },
      ]}
    />
  </Frame>
);
