import { Dropdown } from 'cyberdesign';

// Open menus overflow the trigger, so leave generous room below.
const Frame = ({ children, max = 420 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      paddingBottom: 280,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const ActionsMenu = () => (
  <Frame>
    <Dropdown
      defaultOpen
      trigger="Actions"
      triggerClassName="cd-btn cd-btn--primary"
      items={[
        { heading: true, label: 'Source' },
        { icon: '◎', label: 'Investigate', kbd: '⌘I' },
        { icon: '◈', label: 'Add to watchlist', kbd: '⌘W' },
        { icon: '◉', label: 'Export report' },
        { sep: true },
        { heading: true, label: 'Danger zone' },
        { icon: '✕', label: 'Block source', danger: true },
      ]}
    />
  </Frame>
);

export const FilterMenu = () => (
  <Frame max={360}>
    <Dropdown
      defaultOpen
      trigger="Filter — last 7 days ▾"
      items={[
        { label: 'All events' },
        { label: 'Critical only' },
        { label: 'Last 24h' },
        { label: 'Last 7 days' },
        { sep: true },
        { label: 'Custom range…', disabled: true },
      ]}
    />
  </Frame>
);
