import { Avatar, AvatarGroup } from 'cyberdesign';

const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export const Sizes = () => (
  <Frame>
    <Avatar size="xs" fallback="XS" />
    <Avatar size="sm" fallback="SM" />
    <Avatar fallback="MD" />
    <Avatar size="lg" fallback="LG" />
    <Avatar size="xl" fallback="XL" />
    <Avatar size="lg" glow fallback="NH" />
  </Frame>
);

export const StatusDots = () => (
  <Frame>
    <Avatar status="online" fallback="ON" />
    <Avatar status="away" fallback="AW" />
    <Avatar status="busy" fallback="BS" />
    <Avatar status="offline" fallback="OF" />
  </Frame>
);

export const GroupStack = () => (
  <Frame>
    <AvatarGroup more={8}>
      <Avatar size="sm" status="online" fallback="A1" />
      <Avatar size="sm" status="away" fallback="B2" />
      <Avatar size="sm" status="offline" fallback="C3" />
      <Avatar size="sm" fallback="D4" />
    </AvatarGroup>
  </Frame>
);
