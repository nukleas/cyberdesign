import { PanelHeader } from 'cyberdesign';

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
      gap: 16,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const WithCount = () => (
  <Frame>
    <PanelHeader actions={<span style={{ fontSize: 'var(--cd-text-xs)' }}>12 items</span>}>
      INTEL FEED
    </PanelHeader>
  </Frame>
);

export const LiveIndicator = () => (
  <Frame>
    <PanelHeader
      actions={
        <span
          className="cd-animate-pulse-glow"
          style={{ fontSize: 'var(--cd-text-xs)', color: '#52ff9f' }}
        >
          ● LIVE
        </span>
      }
    >
      SYS.STATUS
    </PanelHeader>
  </Frame>
);
