import React from 'react';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCart } from '../../hooks/useCart';
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

const Checkout: React.FC = () => {
  const { items, subtotal, tax, total } = useCart();

  return (
    <>
      <SEOHead title="Checkout" />
      <CheckoutContainer>
        <PageTitle>Checkout</PageTitle>
        <CheckoutGrid>
          <div>
            <Card>
              <SectionTitle>Billing Information</SectionTitle>
              <Form>
                <Input label="Full Name" placeholder="John Doe" fullWidth required />
                <Input type="email" label="Email" placeholder="your@email.com" fullWidth required />
                <SectionTitle style={{ marginTop: '1rem' }}>Payment</SectionTitle>
                <CardElementWrapper>
                  {/* Stripe CardElement will go here */}
                  <p style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>
                    💳 Stripe Card Element (Configure with live Stripe keys)
                  </p>
                </CardElementWrapper>
                <Button type="submit" fullWidth size="lg">
                  Complete Purchase — {formatPrice(total)}
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
              <SecureBadge>🔒 Secured by Stripe · SSL Encrypted</SecureBadge>
            </Card>
          </div>
        </CheckoutGrid>
      </CheckoutContainer>
    </>
  );
};

export default Checkout;
