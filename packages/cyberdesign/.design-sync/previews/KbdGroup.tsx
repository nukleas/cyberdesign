import { Kbd, KbdGroup } from 'cyberdesign';

const Frame = ({ children, max = 480 }: any) => (
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
      alignItems: 'flex-start',
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const Row = ({ label, children }: any) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    {children}
    <span style={{ fontSize: 11, color: 'var(--cd-text-secondary)' }}>{label}</span>
  </span>
);

export const Shortcuts = () => (
  <Frame>
    <Row label="Command palette">
      <KbdGroup>
        <Kbd accent>⌘</Kbd>
        <Kbd accent>K</Kbd>
      </KbdGroup>
    </Row>
    <Row label="Save file">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>
    </Row>
    <Row label="Force quit">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>esc</Kbd>
      </KbdGroup>
    </Row>
  </Frame>
);

export const CustomSeparator = () => (
  <Frame>
    <Row label="Sequential chord">
      <KbdGroup separator="then">
        <Kbd>g</Kbd>
        <Kbd>p</Kbd>
      </KbdGroup>
    </Row>
  </Frame>
);
