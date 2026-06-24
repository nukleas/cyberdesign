import { AugButton } from 'cyberdesign';

const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export const Variants = () => (
  <Frame>
    <AugButton>Default</AugButton>
    <AugButton variant="primary">Deploy</AugButton>
    <AugButton reverse>Reverse</AugButton>
    <AugButton variant="primary" reverse>Reverse Primary</AugButton>
  </Frame>
);

export const Sizes = () => (
  <Frame>
    <AugButton size="sm" variant="primary">Small</AugButton>
    <AugButton variant="primary">Medium</AugButton>
    <AugButton size="lg" variant="primary">Large</AugButton>
    <AugButton size="lg">Abort</AugButton>
  </Frame>
);
