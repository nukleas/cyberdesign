import { Label } from 'cyberdesign';

const Frame = ({ children, max = 440 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const input: React.CSSProperties = {
  background: 'var(--cd-bg-panel)',
  border: '1px solid var(--cd-border)',
  color: 'var(--cd-text)',
  fontFamily: 'var(--cd-font-mono)',
  fontSize: 12,
  padding: '6px 8px',
  width: '100%',
};

export const Labels = () => (
  <Frame>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Label htmlFor="node-id">Node Identifier</Label>
      <input id="node-id" style={input} defaultValue="edge-7744" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Label htmlFor="api-key" required>API Key</Label>
      <input id="api-key" style={input} placeholder="sk-•••••••••••" />
    </div>
  </Frame>
);
