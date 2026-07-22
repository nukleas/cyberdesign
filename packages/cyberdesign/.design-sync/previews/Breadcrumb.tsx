import { Breadcrumb } from 'cyberdesign';

const Frame = ({ children, max = 540 }: any) => (
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
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Slash = () => (
  <Frame>
    <Breadcrumb
      items={[
        { label: 'Root', href: '#' },
        { label: 'Threats', href: '#' },
        { label: 'Network', href: '#' },
        { label: '192.168.1.44' },
      ]}
    />
  </Frame>
);

export const Arrow = () => (
  <Frame>
    <Breadcrumb
      variant="arrow"
      items={[
        { label: 'Dashboard', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'Event #4921' },
      ]}
    />
  </Frame>
);

export const Dot = () => (
  <Frame>
    <Breadcrumb
      variant="dot"
      items={[
        { label: 'console', href: '#' },
        { label: 'settings', href: '#' },
        { label: 'api-keys' },
      ]}
    />
  </Frame>
);
