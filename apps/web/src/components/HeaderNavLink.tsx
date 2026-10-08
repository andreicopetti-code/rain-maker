'use client';

import Link, { useLinkStatus } from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

function NavPendingMark() {
  const { pending } = useLinkStatus();
  return pending ? <span className="btn-nav-pending-mark" aria-hidden /> : null;
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
  const router = useRouter();

  function prefetchRoute() {
    router.prefetch(href);
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={prefetchRoute}
      onFocus={prefetchRoute}
      onTouchStart={prefetchRoute}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={`btn-nav${active ? ' active' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
      <NavPendingMark />
    </Link>
  );
}
