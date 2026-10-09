'use client';

import '@/app/billing/billing.css';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { AppPageCachePanes, AppPageCacheProvider } from '@/components/AppPageCache';
import { SubscriptionBanner } from '@/components/billing/SubscriptionBanner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FunnelChromeProvider } from '@/lib/funnel/funnel-chrome-context';

const PUBLIC_PREFIXES = ['/', '/login', '/register', '/auth', '/precos', '/billing', '/convite'];

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => prefix !== '/' && pathname.startsWith(prefix),
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <FunnelChromeProvider>
        <AppPageCacheProvider>
          <div className="app-shell">
            <AppHeader />
            {!pathname.startsWith('/billing') && <SubscriptionBanner />}
            <div className="app-shell-content">
              <AppPageCachePanes>{children}</AppPageCachePanes>
            </div>
          </div>
        </AppPageCacheProvider>
      </FunnelChromeProvider>
    </ThemeProvider>
  );
}
