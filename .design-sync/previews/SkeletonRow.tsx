import { Skeleton, SkeletonRow } from 'cyberdesign';

const Frame = ({ children }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxWidth: 320,
    }}
  >
    {children}
  </div>
);

export const ContactRows = () => (
  <Frame>
    <Skeleton shape="block" style={{ gap: 12 }}>
      <SkeletonRow>
        <Skeleton shape="avatar" style={{ width: 36, height: 36 }} />
        <Skeleton shape="block" style={{ flex: 1, gap: 6 }}>
          <Skeleton shape="text" width="3/4" />
          <Skeleton shape="text" width="1/2" />
        </Skeleton>
      </SkeletonRow>
      <SkeletonRow>
        <Skeleton shape="avatar" style={{ width: 36, height: 36 }} />
        <Skeleton shape="block" style={{ flex: 1, gap: 6 }}>
          <Skeleton shape="text" width="full" />
          <Skeleton shape="text" width="1/3" />
        </Skeleton>
      </SkeletonRow>
      <SkeletonRow>
        <Skeleton shape="avatar" style={{ width: 36, height: 36 }} />
        <Skeleton shape="block" style={{ flex: 1, gap: 6 }}>
          <Skeleton shape="text" width="1/2" />
          <Skeleton shape="text" width="3/4" />
        </Skeleton>
      </SkeletonRow>
    </Skeleton>
  </Frame>
);
