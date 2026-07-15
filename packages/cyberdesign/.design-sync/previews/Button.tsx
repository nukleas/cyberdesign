import { Button } from 'cyberdesign';

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
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export const Variants = () => (
  <Frame>
    <Button>Default</Button>
    <Button variant="primary">Primary</Button>
    <Button variant="danger">Danger</Button>
    <Button disabled>Disabled</Button>
  </Frame>
);

export const Sizes = () => (
  <Frame>
    <Button size="sm" variant="primary">Small</Button>
    <Button variant="primary">Medium</Button>
    <Button icon aria-label="Settings">⚙</Button>
    <Button icon size="sm" aria-label="Close">✕</Button>
  </Frame>
);
