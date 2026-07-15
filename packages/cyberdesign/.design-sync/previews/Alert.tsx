import { Alert } from 'cyberdesign';

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
      gap: 10,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Variants = () => (
  <Frame>
    <Alert variant="info" icon="ℹ" title="Information">
      System maintenance window scheduled for 02:00–04:00 UTC.
    </Alert>
    <Alert variant="success" icon="✓" title="Success">
      API key rotated successfully. New key active in 30 seconds.
    </Alert>
    <Alert variant="warning" icon="⚠" title="Warning" onDismiss={() => {}}>
      Rate limit at 87% capacity. Consider upgrading your plan.
    </Alert>
    <Alert variant="error" icon="✕" title="Error">
      Connection to upstream node failed. Failover initiated.
    </Alert>
    <Alert variant="accent" icon="⬡" title="Accent — theme-aware">
      Uses the active theme accent — switches with the theme class.
    </Alert>
  </Frame>
);

export const Compact = () => (
  <Frame max={460}>
    <Alert variant="warning" size="sm" icon="⚡" title="Small variant">
      Compact alert for inline status messages.
    </Alert>
    <Alert variant="info" size="sm" inline icon="ℹ" title="Inline">
      No left accent bar — flush banner style.
    </Alert>
  </Frame>
);
