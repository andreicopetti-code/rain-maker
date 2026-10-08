import Stripe from 'stripe';
import type { BillingInterval } from '@/lib/billing/intervals';

export type { BillingInterval } from '@/lib/billing/intervals';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurada');
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    (process.env.NODE_ENV === 'production'
      ? 'https://www.rainmaker.ia.br'
      : 'http://localhost:3000')
  );
}

/** Price ID mensal: DB → env server → env public. */
export function resolveMonthlyPriceId(dbPriceId: string | null | undefined): string | null {
  return (
    dbPriceId?.trim() ||
    process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY?.trim() ||
    null
  );
}

/** Price ID anual: apenas o valor gravado em plans.stripe_price_annual_id. */
export function resolveAnnualPriceId(dbPriceId: string | null | undefined): string | null {
  return dbPriceId?.trim() || null;
}

export function resolvePlanPriceId(
  interval: BillingInterval,
  monthlyId: string | null | undefined,
  annualId: string | null | undefined,
): string | null {
  return interval === 'year'
    ? resolveAnnualPriceId(annualId)
    : resolveMonthlyPriceId(monthlyId);
}
