import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { media } from '../../styles/breakpoints';

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

const Dashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const displayName = userProfile?.displayName || user?.displayName || 'Operator';

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
          <WelcomeSubtitle>Your learning command center.</WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <Card>
            <StatNumber>0</StatNumber>
            <StatLabel>Courses Enrolled</StatLabel>
          </Card>
          <Card>
            <StatNumber>0</StatNumber>
            <StatLabel>Courses Completed</StatLabel>
          </Card>
          <Card>
            <StatNumber>0</StatNumber>
            <StatLabel>eBooks Owned</StatLabel>
          </Card>
          <Card>
            <StatNumber>0</StatNumber>
            <StatLabel>Saved Articles</StatLabel>
          </Card>
        </StatsGrid>

        <SectionTitle>Continue Learning</SectionTitle>
        <EmptyState>
          <p>You haven't started any courses yet.</p>
          <Link to="/learn">
            <Button>Browse Courses</Button>
          </Link>
        </EmptyState>

        <SectionTitle>My Library</SectionTitle>
        <EmptyState>
          <p>Your purchased products will appear here.</p>
          <Link to="/store">
            <Button variant="outline">Visit Store</Button>
          </Link>
        </EmptyState>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
