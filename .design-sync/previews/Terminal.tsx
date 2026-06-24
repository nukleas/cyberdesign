import { Terminal } from 'cyberdesign';

const Frame = ({ children, max = 560 }: any) => (
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

export const LiveConsole = () => (
  <Frame>
    <Terminal
      title="MAIN CONSOLE — LIVE"
      lines={[
        { text: 'CONNECTED // 192.168.7.44', type: 'system' },
        { text: 'netstat -tuln', type: 'prompt', prompt: 'root@edge> ' },
        { text: 'tcp  0.0.0.0:443   LISTEN', type: 'output' },
        { text: 'tcp  127.0.0.1:8080 LISTEN', type: 'output' },
        { text: 'tail -f /var/log/breach', type: 'prompt', prompt: 'root@edge> ' },
        { text: '14:52:11 — anomalous packet spike' },
        { text: 'ERR: possible exfil attempt', type: 'error' },
      ]}
      input
      inputPrompt="root@edge> "
    />
  </Frame>
);

export const BootLog = () => (
  <Frame>
    <Terminal
      title="SYS.BOOT"
      lines={[
        { text: 'initializing kernel modules...', type: 'system' },
        { text: '[ OK ] mounted /dev/sda1', type: 'output' },
        { text: '[ OK ] network bridge up', type: 'output' },
        { text: '[WARN] thermal sensor 3 offline', type: 'error' },
        { text: 'boot sequence complete in 3.42s', type: 'system' },
      ]}
    />
  </Frame>
);
