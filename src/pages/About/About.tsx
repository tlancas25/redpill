import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { media } from '../../styles/breakpoints';
import { APP_TAGLINE } from '../../utils/constants';

const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const HeroTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  text-shadow: ${({ theme }) => theme.shadows.glow};
  margin-bottom: 1rem;

  ${media.tablet} {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  padding: 3rem 0;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;

  ${media.tablet} {
    font-size: 2rem;
  }
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1rem;
`;

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PillarIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PillarTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const PillarDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.7;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const About: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About"
        description="Learn about the RedPillReader mission to help people build health, wealth, awareness, and sovereignty outside the mainstream script."
        path="/about"
      />

      <AboutContainer>
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            We Are The Architects of Awareness
          </HeroTitle>
          <HeroSubtitle>{APP_TAGLINE}</HeroSubtitle>
        </HeroSection>

        <Section>
          <SectionTitle>Our Vision</SectionTitle>
          <SectionText>
            To build a world where individuals are truly sovereign — physically,
            financially, and mentally. We believe that the matrix is designed to
            keep you weak, broke, and distracted. Our vision is to provide the
            keys to break those chains and empower you to own your future.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Who We Are</SectionTitle>
          <SectionText>
            RedPillReader is a holistic self-improvement platform for those who
            refuse to stay asleep. We are a collective of biohackers, financial
            strategists, technologists, and free thinkers. We believe that true
            freedom comes from mastery of all domains: your body, your bank
            account, and your mind.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>The Three Pillars</SectionTitle>
          <PillarGrid>
            <Card hoverable>
              <PillarIcon>🧬</PillarIcon>
              <PillarTitle>The Body</PillarTitle>
              <PillarDesc>
                Your vessel in this reality. We teach biohacking, nutrition, and
                physical optimization to escape the sick-care system and build
                unshakeable vitality.
              </PillarDesc>
            </Card>
            <Card hoverable>
              <PillarIcon>💰</PillarIcon>
              <PillarTitle>The Wealth</PillarTitle>
              <PillarDesc>
                Money is energy. We provide the blueprints for financial engineering,
                credit repair, and wealth creation to buy your freedom from the
                rat race.
              </PillarDesc>
            </Card>
            <Card hoverable>
              <PillarIcon>🧠</PillarIcon>
              <PillarTitle>The Mind</PillarTitle>
              <PillarDesc>
                The ultimate operating system. We offer tools for psychological
                reprogramming, critical thinking, and technical literacy to decode
                the systems of control.
              </PillarDesc>
            </Card>
          </PillarGrid>
        </Section>

        <CTASection>
          <SectionTitle>Ready to Join?</SectionTitle>
          <SectionText style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Take the red pill. See how deep the rabbit hole goes. Create your free 
            account and start your journey today.
          </SectionText>
          <Link to="/register">
            <Button variant="accent" size="lg">
              Enter The Construct
            </Button>
          </Link>
        </CTASection>
      </AboutContainer>
    </>
  );
};

export default About;
