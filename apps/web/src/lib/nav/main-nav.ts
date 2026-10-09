/** Rotas principais do header — candidatas a keep-alive no cliente. */
export const MAIN_NAV_HREFS = [
  '/funil',
  '/agenda',
  '/dashboard',
  '/contatos',
  '/emails',
  '/empresas',
  '/ceo',
] as const;

export type MainNavHref = (typeof MAIN_NAV_HREFS)[number];

export function navKeyFromPath(pathname: string): MainNavHref | null {
  const match = MAIN_NAV_HREFS.find(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
  return match ?? null;
}
