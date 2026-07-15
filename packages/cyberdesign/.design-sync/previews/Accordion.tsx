import { Accordion } from 'cyberdesign';

const Frame = ({ children, max = 560 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Default = () => (
  <Frame>
    <Accordion
      items={[
        {
          icon: '⬡',
          title: 'Network Intrusion Detection',
          defaultOpen: true,
          content:
            'Monitors inbound and outbound traffic for known attack signatures, port scans, and anomalous packet rates.',
        },
        {
          icon: '◈',
          title: 'Authentication Events',
          content:
            'Tracks login attempts, MFA challenges, session token issuance, and privilege escalations.',
        },
        {
          icon: '◉',
          title: 'Data Exfiltration Signals',
          content:
            'Detects unusually large outbound transfers, DNS tunneling patterns, and access to sensitive file paths.',
        },
        {
          icon: '△',
          title: 'Endpoint Telemetry',
          content:
            'Collects process creation events, registry changes, and file system modifications from all registered endpoints.',
        },
      ]}
    />
  </Frame>
);

export const Separated = () => (
  <Frame max={460}>
    <Accordion
      variant="sep"
      items={[
        {
          title: 'Connection Settings',
          defaultOpen: true,
          content: 'Timeout 30s · Keep-alive enabled · TLS 1.3 required for all upstream nodes.',
        },
        {
          title: 'Rate Limiting',
          content: 'Configure per-source rate limits and burst allowances.',
        },
        {
          title: 'Retry Policy',
          content: 'Exponential backoff, max 5 attempts, jitter ±200ms.',
        },
      ]}
    />
  </Frame>
);
