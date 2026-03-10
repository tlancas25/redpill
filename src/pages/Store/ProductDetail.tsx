import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { media } from '../../styles/breakpoints';
import { formatPrice, formatDuration } from '../../utils/helpers';
import { productsAPI } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: 0.875rem;
  margin-bottom: 2rem;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.desktop} {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageSection = styled.div`
  width: 100%;
`;

const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Badge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 1rem;
  width: fit-content;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.75rem;
  line-height: 1.2;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const ShortDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const TypeBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    max-width: 400px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.8;

  p {
    margin-bottom: 1rem;
  }
`;

const CurriculumList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: module;
`;

const CurriculumItem = styled.li`
  counter-increment: module;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModuleTitle = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95rem;
  font-weight: 500;
`;

const ModuleDuration = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.fonts.code};
  white-space: nowrap;
  margin-left: 1rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const FeatureIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 1rem;
  }
`;

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getBySlug(slug);
        setProduct(response.data.product || null);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, 1);
    window.location.href = '/checkout';
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    window.location.href = '/cart';
  };

  if (loading) {
    return (
      <Container>
        <Loader fullPage text="Loading product..." />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <>
        <SEOHead title="Product Not Found" noindex />
        <Container>
          <BackLink to="/store">← Back to Store</BackLink>
          <ErrorContainer>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/store"><Button>Browse Store</Button></Link>
          </ErrorContainer>
        </Container>
      </>
    );
  }

  const totalDuration = (product.curriculum || []).reduce(
    (sum, mod) => sum + ((mod as any).duration || 0),
    0
  );
  const hasImage = product.images && product.images.length > 0 && product.images[0];
  const displayPrice = product.salePrice ?? product.price;

  return (
    <>
      <SEOHead
        title={product.title}
        description={product.shortDescription || product.description}
        path={`/store/${product.slug}`}
        keywords={[product.category, product.type, product.title]}
      />

      <Container>
        <BackLink to="/store">← Back to Store</BackLink>

        <ProductLayout>
          <ImageSection>
            <ProductImage>
              {hasImage ? (
                <img src={product.images[0]} alt={product.title} />
              ) : (
                product.type === 'course' ? '🎓' : '📘'
              )}
            </ProductImage>
          </ImageSection>

          <InfoSection>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Badge>{product.category}</Badge>
              <TypeBadge>{product.type}</TypeBadge>
            </div>

            <Title>{product.title}</Title>
            <ShortDesc>{product.shortDescription}</ShortDesc>

            <PriceBlock>
              <CurrentPrice>{formatPrice(displayPrice)}</CurrentPrice>
              {product.salePrice && (
                <OriginalPrice>{formatPrice(product.price)}</OriginalPrice>
              )}
            </PriceBlock>

            <FeatureGrid>
              <FeatureItem>
                <FeatureIcon>✓</FeatureIcon>
                Instant access
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>✓</FeatureIcon>
                Lifetime updates
              </FeatureItem>
              {product.type === 'course' && totalDuration > 0 && (
                <FeatureItem>
                  <FeatureIcon>⏱</FeatureIcon>
                  {formatDuration(totalDuration)} of content
                </FeatureItem>
              )}
              {product.type === 'course' && product.curriculum && (
                <FeatureItem>
                  <FeatureIcon>📚</FeatureIcon>
                  {product.curriculum.length} modules
                </FeatureItem>
              )}
              {product.type === 'ebook' && (
                <FeatureItem>
                  <FeatureIcon>📄</FeatureIcon>
                  PDF download
                </FeatureItem>
              )}
              <FeatureItem>
                <FeatureIcon>🔒</FeatureIcon>
                Secure checkout
              </FeatureItem>
            </FeatureGrid>

            <ButtonRow>
              <Button size="lg" fullWidth onClick={handleBuyNow}>
                Buy Now — {formatPrice(displayPrice)}
              </Button>
              <Button size="lg" variant="outline" fullWidth onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </ButtonRow>
          </InfoSection>
        </ProductLayout>

        <Divider />

        <SectionTitle>About This {product.type === 'course' ? 'Course' : 'Book'}</SectionTitle>
        <Description>
          {product.description.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Description>

        {product.type === 'course' && product.curriculum && product.curriculum.length > 0 && (
          <>
            <Divider />
            <SectionTitle>Curriculum</SectionTitle>
            <CurriculumList>
              {product.curriculum.map((mod, i) => (
                <CurriculumItem key={i}>
                  <ModuleTitle>{(mod as any).title || `Module ${i + 1}`}</ModuleTitle>
                  {(mod as any).duration && (
                    <ModuleDuration>{formatDuration((mod as any).duration)}</ModuleDuration>
                  )}
                </CurriculumItem>
              ))}
            </CurriculumList>
          </>
        )}

        <Divider />

        <Card>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <SectionTitle style={{ marginBottom: '0.5rem' }}>Ready to level up?</SectionTitle>
            <ShortDesc style={{ marginBottom: '1.5rem' }}>
              Get instant access to {product.title} and start learning today.
            </ShortDesc>
            <Button size="lg" onClick={handleBuyNow}>
              Get {product.title} — {formatPrice(displayPrice)}
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default ProductDetail;
