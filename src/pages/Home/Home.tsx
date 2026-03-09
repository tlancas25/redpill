import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { media } from '../../styles/breakpoints';
import { APP_NAME } from '../../utils/constants';

const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(0, 255, 65, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow};
  margin-bottom: 1.5rem;
  line-height: 1.1;

  ${media.tablet} {
    font-size: 3.5rem;
  }

  ${media.desktop} {
    font-size: 4.5rem;
  }

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.8;

  ${media.tablet} {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  ${media.tablet} {
    flex-direction: row;
    justify-content: center;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.7;
`;

const CTASection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const CTAText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.8;
`;

const Home: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Decode the System"
        description={`${APP_NAME} helps you master health, wealth, mindset, survival, and digital sovereignty through premium courses, articles, and digital products.`}
        path="/"
        keywords={['red pill', 'self-improvement', 'biohacking', 'wealth creation', 'mindset', 'digital sovereignty']}
      />

      {/* Hero */}
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            TAKE THE <span>RED</span> PILL
          </HeroTitle>
          <HeroSubtitle>
            Break free from the constraints of the matrix. Master your health,
            wealth, and mind. Decode the system and reclaim your sovereignty.
          </HeroSubtitle>
          <HeroButtons>
            <Link to="/store">
              <Button size="lg">Browse Store</Button>
            </Link>
            <Link to="/learn">
              <Button variant="outline" size="lg">
                Start Learning
              </Button>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Features */}
      <FeaturesSection>
        <SectionTitle>Your Path to Sovereignty</SectionTitle>
        <FeaturesGrid>
          <Card hoverable>
            <FeatureIcon>🧬</FeatureIcon>
            <FeatureTitle>Biohacking & Health</FeatureTitle>
            <FeatureDescription>
              Optimize your biology. Escape the sick-care system. Master nutrition,
              fitness, and longevity to build an unshakeable vessel.
            </FeatureDescription>
          </Card>
          <Card hoverable>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Wealth Creation</FeatureTitle>
            <FeatureDescription>
              Escape the rat race. Learn financial engineering, credit mastery,
              and sovereign wealth strategies to buy your freedom.
            </FeatureDescription>
          </Card>
          <Card hoverable>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>Mindset & Psychology</FeatureTitle>
            <FeatureDescription>
              Reprogram your mind. Break limiting beliefs, master social dynamics,
              and develop the mental fortitude of a sovereign individual.
            </FeatureDescription>
          </Card>
          <Card hoverable>
            <FeatureIcon>🛡️</FeatureIcon>
            <FeatureTitle>Tech & Security</FeatureTitle>
            <FeatureDescription>
              Secure your digital life. Master cybersecurity, privacy tools, and
              the technologies that shape our future.
            </FeatureDescription>
          </Card>
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA */}
      <CTASection>
        <SectionTitle>Ready to Wake Up?</SectionTitle>
        <CTAText>
          Join thousands who have already taken the red pill. Get access to 
          exclusive content, courses, and a community of like-minded individuals.
        </CTAText>
        <Link to="/register">
          <Button variant="accent" size="lg">
            Enter The Construct
          </Button>
        </Link>
      </CTASection>
    </>
  );
};

export default Home;
