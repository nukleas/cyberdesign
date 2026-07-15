import { AugPanel } from 'cyberdesign';

const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    {children}
  </div>
);

const heading = (text: string) => (
  <div
    style={{
      fontSize: 9,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'var(--cd-accent)',
      marginBottom: 8,
    }}
  >
    {text}
  </div>
);

const body = (text: string) => (
  <div style={{ fontSize: 11, color: 'var(--cd-text-secondary)', lineHeight: 1.6 }}>{text}</div>
);

export const Diagonal = () => (
  <Frame>
    <AugPanel style={{ width: 240 }}>
      {heading('Node // EDGE-07')}
      {body('Diagonal TL+BR clip with a neon drop-shadow border. Status nominal — 14 active sessions, 0 dropped frames.')}
    </AugPanel>
    <AugPanel size="sm" style={{ width: 200 }}>
      {heading('Small clip')}
      {body('Tighter 6px clip and reduced padding via the sm size.')}
    </AugPanel>
  </Frame>
);

export const FourCorner = () => (
  <Frame>
    <AugPanel corners4 size="lg" style={{ width: 260 }}>
      {heading('Containment Grid')}
      {body('All four corners clipped with the lg padding scale — ideal as a hero status panel inside a HUD layout.')}
    </AugPanel>
  </Frame>
);
