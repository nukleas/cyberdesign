import { Toast } from 'cyberdesign';

const Frame = ({ children, max = 420 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Variants = () => (
  <Frame>
    <Toast variant="success" icon="✓" title="Success" onDismiss={() => {}}>
      Connection established — edge node 192.168.7.44 online.
    </Toast>
    <Toast variant="warning" icon="⚠" title="Warning" onDismiss={() => {}}>
      Maintenance window in 15 min. Active sessions will be drained.
    </Toast>
    <Toast variant="error" icon="✕" title="Error" onDismiss={() => {}}>
      Auth token expired. Re-login required to continue scraping.
    </Toast>
    <Toast variant="info" icon="ℹ" title="Info" onDismiss={() => {}}>
      New event source connected: ingest-pipeline-02.
    </Toast>
    <Toast variant="accent" icon="⬡" title="Accent" onDismiss={() => {}}>
      API key rotated — new key active in 30 seconds.
    </Toast>
  </Frame>
);

export const Minimal = () => (
  <Frame>
    <Toast variant="success" icon="✓" title="Deploy complete">
      Build #4182 promoted to production.
    </Toast>
    <Toast variant="error" icon="✕" title="Block source">
      203.0.113.9 blocked — anomalous outbound traffic on 14 ports.
    </Toast>
  </Frame>
);
