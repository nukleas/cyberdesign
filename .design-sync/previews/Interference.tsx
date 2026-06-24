import { Interference } from 'cyberdesign';

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
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    {children}
  </div>
);

const panel: React.CSSProperties = {
  background: 'var(--cd-bg-panel)',
  border: '1px solid var(--cd-border-glow)',
  padding: 18,
  width: 240,
  minHeight: 120,
};

export const SignalNoise = () => (
  <Frame>
    <Interference intensity="light" style={panel}>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--cd-text-muted)' }}>
        UPLINK
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cd-accent)', marginTop: 8 }}>
        WEAK SIGNAL
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 6 }}>
        light static interference
      </div>
    </Interference>
    <Interference intensity="heavy" style={panel}>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--cd-text-muted)' }}>
        FEED
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cd-accent)', marginTop: 8 }}>
        DEGRADED
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 6 }}>
        heavy noise overlay
      </div>
    </Interference>
  </Frame>
);

export const Corruption = () => (
  <Frame>
    <Interference
      intensity="heavy"
      glitch
      corruptText="BLACKWALL BREACH"
      style={{ ...panel, width: 300 }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--cd-accent)',
          letterSpacing: '0.05em',
        }}
      >
        BLACKWALL BREACH
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 10 }}>
        ICE compromised — rogue AI loose in sector 7
      </div>
    </Interference>
  </Frame>
);
