import { Stat, StatGrid } from 'cyberdesign';

const Frame = ({ children, max = 640 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const MetricGrid = () => (
  <Frame>
    <StatGrid>
      <Stat label="Active Incidents" value="142" delta="+12 today" trend="up" />
      <Stat variant="accent" label="Signal Strength" value="87%" delta="nominal" />
      <Stat variant="red" label="Critical Alerts" value="7" delta="+3 since last scan" trend="up" />
      <Stat variant="yellow" label="Queue Depth" value="2.4k" delta="−18% vs avg" trend="down" />
      <Stat variant="blue" label="Uptime" value="99.9%" delta="31d 4h" />
      <Stat variant="magenta" label="Anomaly Score" value="0.34" delta="within threshold" />
    </StatGrid>
  </Frame>
);

export const SingleBlocks = () => (
  <Frame max={420}>
    <StatGrid>
      <Stat label="Throughput" value="18.2 Gb/s" delta="+4.1% vs avg" trend="up" />
      <Stat variant="red" label="Packet Loss" value="0.8%" delta="−0.2% recovered" trend="down" />
    </StatGrid>
  </Frame>
);
