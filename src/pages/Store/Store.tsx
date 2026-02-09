import React, { useState } from 'react';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { media } from '../../styles/breakpoints';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
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

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Cybersecurity Fundamentals',
    slug: 'cybersecurity-fundamentals',
    description: 'Master the basics of cybersecurity and protect yourself online.',
    shortDescription: 'Learn to protect your digital identity.',
    price: 29.99,
    salePrice: null,
    category: 'Cybersecurity',
    type: 'ebook',
    images: [],
    curriculum: [],
    downloadUrl: '',
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date(),
    featured: true,
  },
  {
    id: '2',
    title: 'Credit Repair Mastery',
    slug: 'credit-repair-mastery',
    description: 'Complete guide to rebuilding and optimizing your credit score.',
    shortDescription: 'Fix your credit score step by step.',
    price: 39.99,
    salePrice: 24.99,
    category: 'Credit Repair',
    type: 'ebook',
    images: [],
    curriculum: [],
    downloadUrl: '',
    rating: 4.9,
    reviewCount: 87,
    createdAt: new Date(),
    featured: true,
  },
  {
    id: '3',
    title: 'Tech Literacy 101',
    slug: 'tech-literacy-101',
    description: 'Essential tech knowledge for the modern age.',
    shortDescription: 'Understand the technology around you.',
    price: 19.99,
    salePrice: null,
    category: 'Tech Literacy',
    type: 'course',
    images: [],
    curriculum: [],
    downloadUrl: '',
    rating: 4.7,
    reviewCount: 35,
    createdAt: new Date(),
    featured: false,
  },
];

const Store: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts =
    activeCategory === 'All'
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <SEOHead title="Store" description="Browse our collection of eBooks and video courses on cybersecurity, credit repair, and tech literacy." />

      <StoreContainer>
        <PageTitle>The Store</PageTitle>

        <FilterBar>
          {PRODUCT_CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              $active={activeCategory === cat}
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
                <ProductImage>📚</ProductImage>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductDesc>{product.shortDescription}</ProductDesc>
                <PriceRow>
                  <Price>
                    {product.salePrice
                      ? formatPrice(product.salePrice)
                      : formatPrice(product.price)}
                  </Price>
                  <Button size="sm">Add to Cart</Button>
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
