import { HudBar, HudSegment } from 'cyberdesign';

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

export const Segments = () => (
  <Frame>
    <HudBar position="top">
      <HudSegment label="CORE" value="STABLE" status="ok" />
      <HudSegment label="LOAD" value="62%" />
      <HudSegment label="ALERT" value="2 OPEN" status="warn" />
    </HudBar>
  </Frame>
);

export const StatusCells = () => (
  <Frame>
    <HudBar>
      <HudSegment label="POWER" value="NOMINAL" status="ok" />
      <HudSegment label="SHIELD" value="LOW" status="warn" />
      <HudSegment label="HULL" value="BREACH" status="err" />
    </HudBar>
  </Frame>
);
