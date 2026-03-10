import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { media } from '../../styles/breakpoints';
import { formatPrice } from '../../utils/helpers';
import { productsAPI } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';

const StoreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.background : theme.colors.textSecondary};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.background : theme.colors.primary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.mobileLg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.large} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ProductTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ProductDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.error};
`;

const Store: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const productCategories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];
  const selectedCategory = productCategories.includes(activeCategory) ? activeCategory : 'All';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <StoreContainer>
        <PageTitle>The Store</PageTitle>
        <Loader fullPage text="Loading products..." />
      </StoreContainer>
    );
  }

  if (error) {
    return (
      <StoreContainer>
        <PageTitle>The Store</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </StoreContainer>
    );
  }

  return (
    <>
      <SEOHead
        title="Store"
        description="Shop RedPillReader eBooks and courses covering AI agents, security, trading bots, and X monetization."
        path="/store"
        keywords={['ebooks', 'online courses', 'AI agents', 'trading bots', 'X monetization']}
      />

      <StoreContainer>
        <PageTitle>The Store</PageTitle>

        <FilterBar>
          {productCategories.map((cat) => (
            <FilterButton
              key={cat}
              $active={selectedCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </FilterBar>

        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <Card key={product.id} hoverable>
                <Link to={`/store/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <ProductImage>
                    {product.type === 'course' ? '🎓' : '📘'}
                  </ProductImage>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductDesc>{product.shortDescription}</ProductDesc>
                </Link>
                <PriceRow>
                  <Price>
                    {product.salePrice
                      ? formatPrice(product.salePrice)
                      : formatPrice(product.price)}
                  </Price>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    Buy Now
                  </Button>
                </PriceRow>
              </Card>
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>No products found in this category.</EmptyState>
        )}
      </StoreContainer>
    </>
  );
};

export default Store;
