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
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    {children}
  </div>
);

export const LoadingCard = () => (
  <Frame>
    <Skeleton shape="card" style={{ width: 220 }}>
      <SkeletonRow>
        <Skeleton shape="avatar" style={{ width: 36, height: 36 }} />
        <Skeleton shape="block" style={{ flex: 1, gap: 6 }}>
          <Skeleton shape="text" width="3/4" />
          <Skeleton shape="text" width="1/2" />
        </Skeleton>
      </SkeletonRow>
      <Skeleton shape="text" width="full" />
      <Skeleton shape="text" width="full" />
      <Skeleton shape="text" width="1/2" />
      <Skeleton shape="btn" style={{ width: 100, marginTop: 4 }} />
    </Skeleton>
  </Frame>
);

export const MediaCard = () => (
  <Frame>
    <Skeleton shape="card" style={{ width: 220 }}>
      <Skeleton style={{ width: '100%', height: 80 }} />
      <Skeleton shape="heading" width="3/4" style={{ marginTop: 4 }} />
      <Skeleton shape="text" width="full" />
      <Skeleton shape="text" width="full" />
      <Skeleton shape="text" width="1/3" />
    </Skeleton>
  </Frame>
);
