'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_HREFS, navKeyFromPath, type MainNavHref } from '@/lib/nav/main-nav';

type PageCacheContextValue = {
  /** Mostra imediatamente a versão em cache da rota (se existir). */
  showCached: (href: string) => boolean;
  hasCached: (href: string) => boolean;
  /** Nav em curso servida do cache — esconde a barra azul de pending. */
  instantFromCache: boolean;
  /** Rota “ativa” visual (inclui overlay otimista). */
  activeNavKey: MainNavHref | null;
  /** Registra o children RSC da rota atual no keep-alive. */
  registerPage: (key: MainNavHref | null, node: ReactNode) => void;
  optimisticKey: MainNavHref | null;
  pageKey: MainNavHref | null;
  getCached: (key: MainNavHref) => ReactNode | undefined;
};

const PageCacheContext = createContext<PageCacheContextValue | null>(null);

export function usePageCache() {
  const ctx = useContext(PageCacheContext);
  if (!ctx) {
    return {
      showCached: () => false,
      hasCached: () => false,
      instantFromCache: false,
      activeNavKey: null as MainNavHref | null,
    };
  }
  return ctx;
}

/**
 * Provider no shell (header + content) para keep-alive das abas do menu.
 * Na 2ª visita, mostra o snapshot em cache na hora; o Next atualiza em background.
 */
export function AppPageCacheProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageKey = navKeyFromPath(pathname);

  const cacheRef = useRef(new Map<MainNavHref, ReactNode>());
  const [, bump] = useState(0);
  const [optimisticKey, setOptimisticKey] = useState<MainNavHref | null>(null);

  const registerPage = useCallback((key: MainNavHref | null, node: ReactNode) => {
    if (!key) return;
    cacheRef.current.set(key, node);
    bump((n) => n + 1);
  }, []);

  const hasCached = useCallback((href: string) => {
    const key = navKeyFromPath(href);
    return Boolean(key && cacheRef.current.has(key));
  }, []);

  const getCached = useCallback((key: MainNavHref) => cacheRef.current.get(key), []);

  const showCached = useCallback((href: string) => {
    const key = navKeyFromPath(href);
    if (!key || !cacheRef.current.has(key)) return false;
    if (key === pageKey) return false;
    setOptimisticKey(key);
    bump((n) => n + 1);
    return true;
  }, [pageKey]);

  // Navegação real chegou — tira o overlay otimista.
  useLayoutEffect(() => {
    setOptimisticKey(null);
  }, [pageKey]);

  const displayKey = optimisticKey ?? pageKey;
  const instantFromCache = optimisticKey != null;

  const ctx = useMemo(
    () => ({
      showCached,
      hasCached,
      instantFromCache,
      activeNavKey: displayKey,
      registerPage,
      optimisticKey,
      pageKey,
      getCached,
    }),
    [
      showCached,
      hasCached,
      instantFromCache,
      displayKey,
      registerPage,
      optimisticKey,
      pageKey,
      getCached,
    ],
  );

  return (
    <PageCacheContext.Provider value={ctx}>{children}</PageCacheContext.Provider>
  );
}

/** Área de conteúdo: mantém panes visitados montados e troca na hora via cache. */
export function AppPageCachePanes({ children }: { children: ReactNode }) {
  const ctx = useContext(PageCacheContext);
  const pathname = usePathname();
  const pageKey = navKeyFromPath(pathname);

  useLayoutEffect(() => {
    ctx?.registerPage(pageKey, children);
  }, [ctx, pageKey, children]);

  if (!ctx || (!pageKey && !ctx.optimisticKey)) {
    return <>{children}</>;
  }

  const { optimisticKey, getCached } = ctx;
  const displayKey = optimisticKey ?? pageKey;

  const keys = MAIN_NAV_HREFS.filter(
    (k) => k === displayKey || k === pageKey || getCached(k) != null,
  );

  return (
    <>
      {keys.map((key) => {
        const active = key === displayKey;
        const node =
          key === pageKey && !optimisticKey
            ? children
            : (getCached(key) ?? null);
        if (!node) return null;
        return (
          <div
            key={key}
            className="app-page-cache-pane"
            hidden={!active}
            aria-hidden={!active}
            style={active ? undefined : { display: 'none' }}
          >
            {node}
          </div>
        );
      })}
    </>
  );
}
