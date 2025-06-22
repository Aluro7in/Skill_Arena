import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceId: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'student',
    name: 'Student Plus',
    priceId: 'price_student_monthly',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited skill access',
      'Premium tutorials',
      'Priority support',
      'Certificate of completion',
      'Study groups access',
      'Mobile app access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Tester',
    priceId: 'price_pro_monthly',
    price: 19.99,
    interval: 'month',
    features: [
      'Everything in Student Plus',
      'Exclusive game testing opportunities',
      'Higher compensation rates',
      'Direct studio partnerships',
      'Advanced analytics dashboard',
      'Professional tester certification',
      'Priority job matching',
      'Mentor program access'
    ]
  },
  {
    id: 'elite',
    name: 'Elite Professional',
    priceId: 'price_elite_monthly',
    price: 39.99,
    interval: 'month',
    features: [
      'Everything in Pro Tester',
      'VIP studio access',
      'Custom learning paths',
      'Personal career coach',
      'Industry networking events',
      'Beta testing for AAA titles',
      'Revenue sharing opportunities',
      'White-glove support',
      'Annual conference tickets'
    ]
  }
];

export class StripeService {
  private stripe: any = null;

  async initialize() {
    this.stripe = await stripePromise;
    return this.stripe;
  }

  async createCheckoutSession(options: {
    mode: 'subscription' | 'payment';
    lineItems: Array<{
      price?: string;
      price_data?: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }>;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session');
      }

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string) {
    if (!this.stripe) {
      await this.initialize();
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  async createSubscriptionCheckout(planId: string, userEmail?: string) {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const session = await this.createCheckoutSession({
      mode: 'subscription',
      lineItems: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/student-upgrade`,
      customerEmail: userEmail,
      metadata: {
        planId: planId,
        planName: plan.name,
      },
    });

    await this.redirectToCheckout(session.id);
  }

  async createMarketplaceCheckout(item: {
    id: string;
    title: string;
    price: number;
    description: string;
    imageUrl?: string;
  }, userEmail?: string) {
    const session = await this.createCheckoutSession({
      mode: 'payment',
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              description: item.description,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      successUrl: `${window.location.origin}/marketplace?success=true&item_id=${item.id}`,
      cancelUrl: `${window.location.origin}/marketplace`,
      customerEmail: userEmail,
      metadata: {
        itemId: item.id,
        itemType: 'marketplace',
      },
    });

    await this.redirectToCheckout(session.id);
  }

  async createTutorialCheckout(tutorial: {
    id: string;
    title: string;
    price: number;
    description: string;
  }, userEmail?: string) {
    const session = await this.createCheckoutSession({
      mode: 'payment',
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Premium Tutorial: ${tutorial.title}`,
              description: tutorial.description,
            },
            unit_amount: Math.round(tutorial.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      successUrl: `${window.location.origin}/tutorials?success=true&tutorial_id=${tutorial.id}`,
      cancelUrl: `${window.location.origin}/tutorials`,
      customerEmail: userEmail,
      metadata: {
        tutorialId: tutorial.id,
        itemType: 'tutorial',
      },
    });

    await this.redirectToCheckout(session.id);
  }

  async createCustomerPortalSession(customerId: string) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/profile`,
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create portal session');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(customerId: string) {
    try {
      const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get subscription status');
      }

      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();