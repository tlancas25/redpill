import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import { media } from '../../styles/breakpoints';

const CartContainer = styled.div`
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

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.desktop} {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QtyButton = styled.button`
  width: 30px;
  height: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Qty = styled.span`
  min-width: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RemoveButton = styled.button`
  background: none;
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const SummaryTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
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
  margin-top: 0.75rem;
`;

const CheckoutLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <>
        <SEOHead title="Cart" />
        <CartContainer>
          <EmptyCart>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/store">
              <Button>Browse Store</Button>
            </Link>
          </EmptyCart>
        </CartContainer>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Cart"
        description="Review items in your RedPillReader cart before checkout."
        path="/cart"
        noindex
      />
      <CartContainer>
        <PageTitle>Your Cart</PageTitle>
        <CartLayout>
          <div>
            {items.map((item) => (
              <CartItem key={item.product.id}>
                <ItemImage>📦</ItemImage>
                <ItemInfo>
                  <ItemTitle>{item.product.title}</ItemTitle>
                  <ItemPrice>
                    {formatPrice(item.product.salePrice || item.product.price)}
                  </ItemPrice>
                  <RemoveButton onClick={() => removeFromCart(item.product.id)}>
                    Remove
                  </RemoveButton>
                </ItemInfo>
                <QuantityControls>
                  <QtyButton onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    −
                  </QtyButton>
                  <Qty>{item.quantity}</Qty>
                  <QtyButton onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    +
                  </QtyButton>
                </QuantityControls>
              </CartItem>
            ))}
          </div>

          <Card>
            <SummaryTitle>Order Summary</SummaryTitle>
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
            <CheckoutLink to="/checkout">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </CheckoutLink>
          </Card>
        </CartLayout>
      </CartContainer>
    </>
  );
};

export default CartPage;
