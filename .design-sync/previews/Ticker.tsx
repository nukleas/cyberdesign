import { Ticker } from 'cyberdesign';

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
      maxWidth: 620,
    }}
  >
    {children}
  </div>
);

export const LiveFeed = () => (
  <Frame>
    <Ticker
      items={[
        'LIVE FEED',
        'ANOMALY 47.2',
        'FIREWALL ACTIVE',
        'THREAT ELEVATED',
        'TRAFFIC 2.4M PKT/S',
        'SUBJECT 47 ACTIVE',
      ]}
    />
  </Frame>
);

export const Speeds = () => (
  <Frame>
    <Ticker
      fast
      items={['FAST FEED', 'BREACH SECTOR 4', 'PACKET SPIKE', 'NODE OFFLINE']}
    />
    <Ticker
      speed="slow"
      items={['SLOW FEED MODE', 'ARCHIVE SYNC 12%', 'NO NEW THREATS', 'ALL CLEAR']}
    />
  </Frame>
);
