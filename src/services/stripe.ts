import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
const apiBaseUrl = (process.env.REACT_APP_API_URL || '/api').replace(/\/$/, '');

export const stripePromise = loadStripe(stripePublishableKey);
export const isStripeConfigured = Boolean(stripePublishableKey);

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) => {
  const response = await fetch(`${apiBaseUrl}/orders/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, metadata }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create payment intent');
  }

  return data;
};

export const getApiBaseUrl = () => apiBaseUrl;
