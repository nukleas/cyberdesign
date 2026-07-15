import { Pagination } from 'cyberdesign';

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

const Label = ({ children }: any) => (
  <span style={{ fontSize: 10, letterSpacing: 1, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>
    {children}
  </span>
);

export const Windowed = () => (
  <Frame>
    <Label>Event log — page 3 of 12</Label>
    <Pagination page={3} pageCount={12} onPageChange={() => {}} />
  </Frame>
);

export const Compact = () => (
  <Frame max={420}>
    <Label>Compact with info</Label>
    <Pagination page={2} pageCount={3} compact showInfo onPageChange={() => {}} />
    <Label>Small size — first page</Label>
    <Pagination page={1} pageCount={8} size="sm" onPageChange={() => {}} />
  </Frame>
);
