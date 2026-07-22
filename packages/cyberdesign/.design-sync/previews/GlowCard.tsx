import { GlowCard } from 'cyberdesign';

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

const titleStyle = {
  fontSize: 'var(--cd-text-sm)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: 8,
};
const bodyStyle = {
  fontSize: 'var(--cd-text-xs)',
  color: 'var(--cd-text-secondary)',
  lineHeight: 1.6,
};

const Card = ({ color, title, body, active }: any) => (
  <GlowCard color={color} active={active} style={{ width: 200 }}>
    <div style={titleStyle}>{title}</div>
    <div style={bodyStyle}>{body}</div>
  </GlowCard>
);

export const AccentColors = () => (
  <Frame>
    <Card color="orange" title="Orange" body="Default orange accent. Hover me." />
    <Card color="cyan" title="Cyan" body="Cyan accent. Hover me." />
    <Card color="magenta" title="Magenta — active" body="Secondary accent, active state." active />
  </Frame>
);

export const CategoryColors = () => (
  <Frame>
    <Card color="green" title="Green" body="Transit / system active." />
    <Card color="red" title="Red" body="Crime / alert category." />
    <Card color="blue" title="Blue" body="Weather / data category." />
    <Card color="purple" title="Purple" body="AI / secondary feature." />
  </Frame>
);
