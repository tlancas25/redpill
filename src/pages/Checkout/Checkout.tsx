import React, { useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { createPaymentIntent, getApiBaseUrl, isStripeConfigured, stripePromise } from '../../services/stripe';
import { formatPrice } from '../../utils/helpers';
import { media } from '../../styles/breakpoints';

const CheckoutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.desktop} {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CardElementWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SecureBadge = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 1rem;
`;

const PaymentSectionTitle = styled(SectionTitle)`
  margin-top: 1rem;
`;

const PaymentHint = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const StatusMessage = styled.p<{ $error?: boolean }>`
  color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.primary)};
  font-size: 0.875rem;
  text-align: center;
`;

const cardElementOptions = {
  style: {
    base: {
      color: '#f5f5f5',
      fontSize: '16px',
      '::placeholder': {
        color: '#8a8a8a',
      },
    },
    invalid: {
      color: '#ff5f56',
    },
  },
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [billingName, setBillingName] = useState(userProfile?.displayName || user?.displayName || '');
  const [billingEmail, setBillingEmail] = useState(user?.email || userProfile?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not finished loading. Please try again.');
      return;
    }

    if (!billingName || !billingEmail) {
      setErrorMessage('Billing name and email are required.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Payment form is unavailable. Refresh and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { clientSecret } = await createPaymentIntent(Math.round(total * 100), 'usd', {
        customerEmail: billingEmail,
        customerName: billingName,
        itemCount: String(items.length),
        userId: user?.uid || 'guest',
      });

      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName,
            email: billingEmail,
          },
        },
      });

      if (confirmation.error) {
        throw new Error(confirmation.error.message || 'Payment confirmation failed');
      }

      if (!confirmation.paymentIntent || confirmation.paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not completed. Please try again.');
      }

      const orderResponse = await fetch(`${getApiBaseUrl()}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: confirmation.paymentIntent.id,
          items,
          subtotal,
          tax,
          total,
          userId: user?.uid || null,
          customer: {
            name: billingName,
            email: billingEmail,
          },
        }),
      });

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Order confirmation failed');
      }

      clearCart();
      setSuccessMessage(`Payment successful. Your order ${orderResult.orderId} has been recorded.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Secure Checkout"
        description="Complete your RedPillReader purchase securely with Stripe."
        path="/checkout"
        noindex
      />
      <CheckoutContainer>
        <PageTitle>Checkout</PageTitle>
        <CheckoutGrid>
          <div>
            <Card>
              <SectionTitle>Billing Information</SectionTitle>
              <Form onSubmit={handleSubmit}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={billingName}
                  onChange={(event) => setBillingName(event.target.value)}
                  fullWidth
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={billingEmail}
                  onChange={(event) => setBillingEmail(event.target.value)}
                  fullWidth
                  required
                />
                <PaymentSectionTitle>Payment</PaymentSectionTitle>
                <CardElementWrapper>
                  <CardElement options={cardElementOptions} />
                </CardElementWrapper>
                <PaymentHint>Payments are encrypted and processed securely by Stripe.</PaymentHint>
                {errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}
                {successMessage && <StatusMessage>{successMessage}</StatusMessage>}
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Complete Purchase - {formatPrice(total)}
                </Button>
              </Form>
            </Card>
          </div>

          <div>
            <Card>
              <SectionTitle>Order Summary</SectionTitle>
              {items.map((item) => (
                <SummaryRow key={item.product.id}>
                  <span>{item.product.title} × {item.quantity}</span>
                  <span>{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                </SummaryRow>
              ))}
              <SummaryRow>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </SummaryRow>
              <TotalRow>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </TotalRow>
              <SecureBadge>Secured by Stripe · SSL Encrypted</SecureBadge>
            </Card>
          </div>
        </CheckoutGrid>
      </CheckoutContainer>
    </>
  );
};

const Checkout: React.FC = () => {
  if (!isStripeConfigured) {
    return (
      <>
        <SEOHead
          title="Secure Checkout"
          description="Stripe is not configured yet for checkout."
          path="/checkout"
          noindex
        />
        <CheckoutContainer>
          <PageTitle>Checkout Unavailable</PageTitle>
          <Card>
            <PaymentHint>Stripe publishable key is not configured for this environment.</PaymentHint>
          </Card>
        </CheckoutContainer>
      </>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
