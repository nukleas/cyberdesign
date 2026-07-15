import { Scanner } from 'cyberdesign';

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
  minHeight: 130,
};

export const Analyzing = () => (
  <Frame>
    <Scanner style={panel}>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--cd-text-muted)' }}>
        BIOMETRIC SCAN
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cd-accent)', marginTop: 8 }}>
        SUBJECT 47
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 6 }}>
        analyzing retinal pattern…
      </div>
    </Scanner>
  </Frame>
);

export const SweepModes = () => (
  <Frame>
    <Scanner vertical style={panel}>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--cd-text-muted)' }}>
        LIDAR SWEEP
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cd-accent)', marginTop: 8 }}>
        SECTOR 9
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 6 }}>
        vertical top-to-bottom
      </div>
    </Scanner>
    <Scanner ping style={panel}>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--cd-text-muted)' }}>
        RADAR PING
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cd-accent)', marginTop: 8 }}>
        12 CONTACTS
      </div>
      <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', marginTop: 6 }}>
        faint return sweep
      </div>
    </Scanner>
  </Frame>
);
