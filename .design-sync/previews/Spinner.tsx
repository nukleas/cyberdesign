import { Spinner } from 'cyberdesign';

const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export const Sizes = () => (
  <Frame>
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </Frame>
);

export const Dual = () => (
  <Frame>
    <Spinner size="sm" variant="dual" />
    <Spinner variant="dual" />
    <Spinner size="lg" variant="dual" />
  </Frame>
);

export const Dots = () => (
  <Frame>
    <Spinner variant="dots" />
    <Spinner size="lg" variant="dots" />
  </Frame>
);
