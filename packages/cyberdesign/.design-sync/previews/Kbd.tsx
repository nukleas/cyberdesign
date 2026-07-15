import { Kbd } from 'cyberdesign';

const Frame = ({ children, max = 480 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Sizes = () => (
  <Frame>
    <Kbd>esc</Kbd>
    <Kbd>tab</Kbd>
    <Kbd>⌘</Kbd>
    <Kbd size="lg">⏎</Kbd>
    <Kbd size="lg">⌫</Kbd>
  </Frame>
);

export const Accent = () => (
  <Frame>
    <Kbd accent>⌘</Kbd>
    <Kbd accent>K</Kbd>
    <Kbd accent size="lg">⎵</Kbd>
    <Kbd>fn</Kbd>
  </Frame>
);
