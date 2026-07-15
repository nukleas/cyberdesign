import { Gauge } from 'cyberdesign';

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
      gap: 24,
      flexWrap: 'wrap',
      alignItems: 'flex-end',
    }}
  >
    {children}
  </div>
);

export const Radials = () => (
  <Frame>
    <Gauge value={78} label="Sync" />
    <Gauge value={62} label="Radar" radar />
    <Gauge value={47} label="Hull" variant="warn" />
  </Frame>
);

export const StatusVariants = () => (
  <Frame>
    <Gauge value={91} label="Power" variant="success" size="small" />
    <Gauge value={34} label="Shield" variant="danger" size="small" />
    <Gauge value={68} label="Core" size="small" />
  </Frame>
);
