import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCartContext } from '../../context/CartContext';
import { Product } from '../../types';

const mockProduct: Product = {
  id: 'test-1',
  title: 'Test Product',
  description: 'A test product',
  price: 29.99,
  category: 'books',
  image: '',
  images: [],
  inStock: true,
  rating: 4.5,
  reviewCount: 10,
  createdAt: new Date().toISOString(),
};

const mockProduct2: Product = {
  id: 'test-2',
  title: 'Test Product 2',
  description: 'Another test product',
  price: 49.99,
  category: 'courses',
  image: '',
  images: [],
  inStock: true,
  rating: 4.0,
  reviewCount: 5,
  createdAt: new Date().toISOString(),
};

// Helper component to test cart context
const CartTestConsumer: React.FC = () => {
  const { items, addToCart, removeFromCart, clearCart, getItemCount, subtotal } =
    useCartContext();

  return (
    <div>
      <p data-testid="item-count">{getItemCount()}</p>
      <p data-testid="subtotal">{subtotal.toFixed(2)}</p>
      <p data-testid="items">{items.map((i) => i.product.title).join(',')}</p>
      <button onClick={() => addToCart(mockProduct)}>Add Product 1</button>
      <button onClick={() => addToCart(mockProduct2)}>Add Product 2</button>
      <button onClick={() => removeFromCart('test-1')}>Remove Product 1</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
};

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  test('starts with empty cart', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0.00');
  });

  test('adds item to cart', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product 1'));

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('subtotal').textContent).toBe('29.99');
  });

  test('adds multiple different items', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('subtotal').textContent).toBe('79.98');
  });

  test('increments quantity when adding same item', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('subtotal').textContent).toBe('59.98');
  });

  test('removes item from cart', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Remove Product 1'));

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('items').textContent).toBe('Test Product 2');
  });

  test('clears all items', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Clear Cart'));

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0.00');
  });
});
