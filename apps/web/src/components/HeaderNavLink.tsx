'use client';

import Link, { useLinkStatus } from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { usePageCache } from '@/components/AppPageCache';

function NavPendingMark({ suppress }: { suppress: boolean }) {
  const { pending } = useLinkStatus();
  if (suppress || !pending) return null;
  return <span className="btn-nav-pending-mark" aria-hidden />;
}

type HeaderNavLinkProps = {
  href: string;
  active: boolean;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function HeaderNavLink({
  href,
  active,
  ariaLabel,
  children,
  className,
  style,
}: HeaderNavLinkProps) {
  const { showCached, instantFromCache } = usePageCache();

  return (
    <Link
      href={href}
      prefetch
      onClick={() => {
        showCached(href);
      }}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={`btn-nav${active ? ' active' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
      <NavPendingMark suppress={instantFromCache} />
    </Link>
  );
}
