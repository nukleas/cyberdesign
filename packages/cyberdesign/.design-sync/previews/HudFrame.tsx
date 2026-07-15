import { HudFrame } from 'cyberdesign';

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
      gap: 14,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    {children}
  </div>
);

export const StatPanels = () => (
  <Frame>
    <HudFrame label="Active Connections" value="1,284" style={{ width: 200 }} />
    <HudFrame label="Integrity" value="94%" status="ok" style={{ width: 200 }} />
    <HudFrame label="Threat Level" value="ELEVATED" status="warn" style={{ width: 200 }} />
  </Frame>
);

export const StatusVariants = () => (
  <Frame>
    <HudFrame label="Link" value="SECURE" status="ok" style={{ width: 180 }} />
    <HudFrame label="Latency" value="248 ms" status="warn" style={{ width: 180 }} />
    <HudFrame label="Breach" value="DETECTED" status="err" style={{ width: 180 }} />
    <HudFrame compact floating label="Signal" value="████████░░ 81%" style={{ width: 200 }} />
  </Frame>
);
