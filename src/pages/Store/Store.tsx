import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { media } from '../../styles/breakpoints';
import { formatPrice, debounce } from '../../utils/helpers';
import { productsAPI } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';

// ==================== Store Hero ====================
const StoreHero = styled.section`
  text-align: center;
  padding: 3rem 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 4rem 2rem 2.5rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 0.75rem;
  text-shadow: ${({ theme }) => theme.shadows.glow};

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto;
`;

// ==================== Search & Toolbar ====================
const StoreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;

  ${media.tablet} {
    padding: 0 2rem 4rem;
  }
`;

const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto 2rem;
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px rgba(0, 255, 65, 0.2);
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.5rem;
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

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ProductCount = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.fonts.heading};
  letter-spacing: 0.5px;
`;

const SortSelect = styled.select`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.7rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

// ==================== Product Grid ====================
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

// ==================== Product Card Styles ====================
const ProductCardWrapper = styled.div`
  position: relative;
`;

const SaleBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.625rem;
  padding: 0.3rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  font-weight: 700;
`;

const ProductImage = styled.div<{ $type: string }>`
  width: 100%;
  height: 200px;
  background: ${({ $type }) =>
    $type === 'course'
      ? 'linear-gradient(135deg, rgba(0, 255, 65, 0.06) 0%, rgba(0, 143, 17, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(255, 51, 51, 0.06) 0%, rgba(255, 204, 0, 0.10) 100%)'};
  border: 1px solid rgba(0, 255, 65, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const TypeBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.6rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 0.5rem;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 0.5rem;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
`;

const OriginalPrice = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  text-decoration: line-through;
  opacity: 0.7;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
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

// ==================== Animation Variants ====================
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: Math.min(i * 0.05, 0.6) },
  }),
};

// ==================== Store Component ====================
const Store: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const productCategories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];
  const selectedCategory = productCategories.includes(activeCategory) ? activeCategory : 'All';

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

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

  const filteredAndSorted = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default: // 'featured'
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleBuyNow = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      window.location.href = '/checkout';
    },
    [addToCart]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    },
    [addToCart]
  );

  const getDiscountPercent = (product: Product) => {
    if (!product.salePrice || product.salePrice >= product.price) return null;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  };

  if (loading) {
    return (
      <StoreContainer>
        <StoreHero>
          <PageTitle>The Arsenal</PageTitle>
        </StoreHero>
        <Loader fullPage text="Loading products..." />
      </StoreContainer>
    );
  }

  if (error) {
    return (
      <StoreContainer>
        <StoreHero>
          <PageTitle>The Arsenal</PageTitle>
        </StoreHero>
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

      <StoreHero>
        <PageTitle>The Arsenal</PageTitle>
        <HeroSubtitle>
          Premium courses and ebooks built for builders, operators, and sovereign thinkers.
          Every product is designed to give you an unfair advantage.
        </HeroSubtitle>
      </StoreHero>

      <StoreContainer>
        {/* Search */}
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        {/* Category Filters */}
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

        {/* Toolbar: Count + Sort */}
        <ToolbarRow>
          <ProductCount>
            {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'product' : 'products'}
          </ProductCount>
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="name">Name</option>
          </SortSelect>
        </ToolbarRow>

        {/* Product Grid */}
        {filteredAndSorted.length > 0 ? (
          <ProductGrid>
            {filteredAndSorted.map((product, index) => {
              const discount = getDiscountPercent(product);
              return (
                <motion.div
                  key={product.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                >
                  <ProductCardWrapper>
                    {discount && <SaleBadge>-{discount}%</SaleBadge>}
                    <Card hoverable>
                      <Link to={`/store/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <ProductImage $type={product.type}>
                          {product.type === 'course' ? '🎓' : '📘'}
                        </ProductImage>
                        <TypeBadge>
                          {product.type === 'course' ? 'COURSE' : 'EBOOK'}
                        </TypeBadge>
                        <ProductTitle>{product.title}</ProductTitle>
                        <ProductDesc>{product.shortDescription}</ProductDesc>
                      </Link>
                      <PriceRow>
                        <PriceGroup>
                          {product.salePrice && product.salePrice < product.price ? (
                            <>
                              <OriginalPrice>{formatPrice(product.price)}</OriginalPrice>
                              <Price>{formatPrice(product.salePrice)}</Price>
                            </>
                          ) : (
                            <Price>{formatPrice(product.price)}</Price>
                          )}
                        </PriceGroup>
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            {addedId === product.id ? '✓ Added' : 'Add to Cart'}
                          </Button>
                          <Button size="sm" onClick={() => handleBuyNow(product)}>
                            Buy Now
                          </Button>
                        </ButtonGroup>
                      </PriceRow>
                    </Card>
                  </ProductCardWrapper>
                </motion.div>
              );
            })}
          </ProductGrid>
        ) : (
          <EmptyState>
            {searchQuery
              ? `No products found for "${searchQuery}".`
              : 'No products found in this category.'}
          </EmptyState>
        )}
      </StoreContainer>
    </>
  );
};

export default Store;
