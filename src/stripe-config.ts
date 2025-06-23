export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
  price?: number;
  currency?: string;
  interval?: 'month' | 'year';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'premium-monthly',
    priceId: 'price_1RctxSRtl07aE8XKVTIjMkyp',
    name: 'Premium Individual',
    description: 'Advanced learning with unlimited projects and premium content',
    mode: 'subscription',
    price: 14.99,
    currency: 'usd',
    interval: 'month'
  },
  {
    id: 'premium-yearly',
    priceId: 'price_1RctxSRtl07aE8XKVTIjMkyp',
    name: 'Premium Individual (Annual)',
    description: 'Advanced learning with unlimited projects and premium content - Save 17%',
    mode: 'subscription',
    price: 149.99,
    currency: 'usd',
    interval: 'year'
  },
  {
    id: 'teams',
    priceId: 'price_1RctxSRtl07aE8XKVTIjMkyp',
    name: 'Teams',
    description: 'Collaborative workspace with advanced team features',
    mode: 'subscription',
    price: 39.99,
    currency: 'usd',
    interval: 'month'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}