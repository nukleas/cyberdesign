import { Checkbox } from 'cyberdesign';

const Frame = ({ children, max = 360 }: any) => (
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

export const States = () => (
  <Frame>
    <Checkbox label="Enable telemetry" />
    <Checkbox label="Stream live events" defaultChecked />
    <Checkbox label="Mask PII in logs" defaultChecked />
    <Checkbox label="Beta channel" disabled />
    <Checkbox label="Force HTTPS" defaultChecked disabled />
  </Frame>
);

export const WithDescription = () => (
  <Frame max={400}>
    <Checkbox
      label="Auto-failover"
      description="Reroute traffic to the standby node on health-check failure."
      defaultChecked
    />
    <Checkbox
      label="Retain raw packets"
      description="Stores full captures for 30 days. Increases disk usage."
    />
  </Frame>
);
