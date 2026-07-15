import { Radio } from 'cyberdesign';

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

const grpLabel = (text: string) => (
  <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cd-text-muted)' }}>{text}</span>
);

export const States = () => (
  <Frame>
    {grpLabel('Log level')}
    <Radio name="loglevel" label="Verbose — all events" />
    <Radio name="loglevel" label="Standard — warnings + errors" defaultChecked />
    <Radio name="loglevel" label="Quiet — errors only" />
    <Radio name="loglevel" label="Off (disabled)" disabled />
  </Frame>
);

export const WithDescription = () => (
  <Frame max={400}>
    {grpLabel('Deployment target')}
    <Radio
      name="target"
      label="Edge node"
      description="Lowest latency. Limited compute capacity."
      defaultChecked
    />
    <Radio
      name="target"
      label="Core cluster"
      description="High throughput. Adds ~40ms routing overhead."
    />
  </Frame>
);
