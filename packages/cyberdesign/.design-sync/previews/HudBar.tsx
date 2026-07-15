import { HudBar } from 'cyberdesign';

// Paints the cyberpunk dark canvas + sets the theme accent. The preview host
// does NOT apply --cd-bg, so every story must frame itself.
const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    {children}
  </div>
);

export const StatusBar = () => (
  <Frame>
    <HudBar
      position="top"
      segments={[
        { label: 'SYS', value: 'ONLINE', status: 'ok' },
        { label: 'UPTIME', value: '417:22:08' },
        { label: 'THREAT', value: 'MED', status: 'warn' },
        { label: 'USER', value: 'ROOT@EDGE' },
      ]}
    />
  </Frame>
);

export const LocationBar = () => (
  <Frame>
    <HudBar
      position="bottom"
      segments={[
        { label: 'LOC', value: 'NIGHT CITY • 7' },
        { label: 'TIME', value: '04:17:52' },
        { label: 'LINK', value: 'SECURE', status: 'ok' },
        { label: 'BREACH', value: 'ACTIVE', status: 'err' },
      ]}
    />
  </Frame>
);
