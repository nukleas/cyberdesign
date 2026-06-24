import { Tooltip, Badge } from 'cyberdesign';

const Frame = ({ children, max = 480 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 48,
      display: 'flex',
      gap: 28,
      flexWrap: 'wrap',
      alignItems: 'center',
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const trigger: React.CSSProperties = {
  borderBottom: '1px dashed var(--cd-accent)',
  color: 'var(--cd-text)',
  fontSize: 12,
};

export const Triggers = () => (
  <Frame>
    <Tooltip tip="Rotates every 24h">
      <span style={trigger}>API key status</span>
    </Tooltip>
    <Tooltip tip="Mesh relay online">
      <Badge color="green">● relay</Badge>
    </Tooltip>
  </Frame>
);

export const Below = () => (
  <Frame max={360}>
    <Tooltip tip="Shown below the trigger" below>
      <span style={trigger}>hover me ↓</span>
    </Tooltip>
  </Frame>
);
