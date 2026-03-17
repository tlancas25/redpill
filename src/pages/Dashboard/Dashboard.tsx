import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../hooks/useAuth';
import { media } from '../../styles/breakpoints';
import { productsAPI } from '../../services/api';
import { Product } from '../../types';
import PurchasedProductCard from './PurchasedProductCard';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 3rem;

  ${media.mobileLg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  p {
    margin-bottom: 1rem;
  }
`;

const LibraryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.mobileLg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Dashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const displayName = userProfile?.displayName || user?.displayName || 'Operator';
  
  const [libraryProducts, setLibraryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      // If we don't know the purchased products, skip
      const productIds = userProfile?.purchasedProducts || [];
      if (productIds.length === 0) {
        setLibraryProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // We'll hit products API to get all, then filter just to save building a special endpoint
        // A better long-term approach is a dedicated /users/me/products endpoint
        const response = await productsAPI.getAll();
        const allProducts = response.data.products || [];
        
        const owned = allProducts.filter((p: Product) => productIds.includes(p.id));
        setLibraryProducts(owned);
      } catch (err) {
        console.error('Failed to load library:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) {
      fetchLibrary();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  const coursesEnrolled = libraryProducts.filter(p => p.type === 'course' || p.type === 'bundle').length;
  const ebooksOwned = libraryProducts.filter(p => p.type === 'ebook').length;
  
  return (
    <>
      <SEOHead
        title="Dashboard"
        description="Manage your RedPillReader library, saved content, and learning progress."
        path="/dashboard"
        noindex
      />

      <DashboardContainer>
        <WelcomeSection>
          <WelcomeTitle>Welcome, {displayName}</WelcomeTitle>
          <WelcomeSubtitle>
            Your learning command center. <Link to="/settings" style={{ color: 'inherit', textDecoration: 'underline' }}>Account Settings</Link>
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <Card>
            <StatNumber>{coursesEnrolled}</StatNumber>
            <StatLabel>Courses Enrolled</StatLabel>
          </Card>
          <Card>
            <StatNumber>0</StatNumber>
            <StatLabel>Courses Completed</StatLabel>
          </Card>
          <Card>
            <StatNumber>{ebooksOwned}</StatNumber>
            <StatLabel>eBooks Owned</StatLabel>
          </Card>
          <Card>
            <StatNumber>{userProfile?.savedArticles?.length || 0}</StatNumber>
            <StatLabel>Saved Articles</StatLabel>
          </Card>
        </StatsGrid>

        <SectionTitle>Continue Learning</SectionTitle>
        {coursesEnrolled > 0 ? (
          <LibraryGrid>
            {libraryProducts.filter(p => p.type === 'course' || p.type === 'bundle').map(course => (
              <PurchasedProductCard key={course.id} product={course} userId={user?.uid || ''} />
            ))}
          </LibraryGrid>
        ) : (
          <EmptyState>
            <p>You haven't started any courses yet.</p>
            <Link to="/learn">
              <Button>Browse Courses</Button>
            </Link>
          </EmptyState>
        )}

        <SectionTitle style={{ marginTop: '3rem' }}>My Library</SectionTitle>
        {loading ? (
          <Loader text="Loading your library..." />
        ) : libraryProducts.length > 0 ? (
          <LibraryGrid>
            {libraryProducts.map(product => (
              <PurchasedProductCard key={product.id} product={product} userId={user?.uid || ''} />
            ))}
          </LibraryGrid>
        ) : (
          <EmptyState>
            <p>Your purchased products will appear here.</p>
            <Link to="/store">
              <Button variant="outline">Visit Store</Button>
            </Link>
          </EmptyState>
        )}
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
