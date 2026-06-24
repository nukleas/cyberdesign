import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source. When set, renders `<img>`; otherwise shows `fallback` initials. */
  src?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Initials shown when no `src` (e.g. "NH"). */
  fallback?: ReactNode;
  /** Diameter preset. `md` is the default (no modifier). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Neon ring around the avatar. */
  glow?: boolean;
  /** Presence dot rendered via `data-status`. */
  status?: 'online' | 'away' | 'busy' | 'offline';
}

/** Circular avatar — image or fallback initials, sized presets, neon glow ring and presence dot. */
export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  glow = false,
  status,
  className = '',
  ...rest
}: AvatarProps) {
  return (
    <div
      className={cx(
        'cd-avatar',
        size !== 'md' && `cd-avatar--${size}`,
        glow && 'cd-avatar--glow',
        className,
      )}
      data-status={status}
      {...rest}
    >
      {src != null ? (
        <img className="cd-avatar__image" src={src} alt={alt} />
      ) : (
        <span className="cd-avatar__fallback">{fallback}</span>
      )}
    </div>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Overflow count rendered as a trailing `+N` badge. */
  more?: number;
  /** Avatars to stack, in order. */
  children?: ReactNode;
}

/** Overlapping stack of avatars with an optional `+N` overflow badge. */
export function AvatarGroup({ more, className = '', children, ...rest }: AvatarGroupProps) {
  return (
    <div className={cx('cd-avatar-group', className)} {...rest}>
      {children}
      {more != null && more > 0 && <span className="cd-avatar-group__more">+{more}</span>}
    </div>
  );
}

Avatar.Group = AvatarGroup;
