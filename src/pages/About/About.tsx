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
      <SEOHead title="About Us" description="We Are The Architects of Awareness. Learn about the RedPillReader mission." />

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
            To build a world where information is the great equalizer — where anyone,
            regardless of background, can access the knowledge needed to secure their 
            digital life, repair their financial standing, and master the technologies 
            shaping our future.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Who We Are</SectionTitle>
          <SectionText>
            RedPillReader is a digital knowledge platform built for those who refuse to 
            stay asleep. We are educators, technologists, and financial strategists who 
            believe that the most powerful weapon in the modern world is knowledge. Our 
            content is designed to break down complex systems — cybersecurity, credit, 
            and technology — into actionable intelligence that anyone can use.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>What We Do</SectionTitle>
          <PillarGrid>
            <Card hoverable>
              <PillarIcon>🛡️</PillarIcon>
              <PillarTitle>The Shield</PillarTitle>
              <PillarDesc>
                Cyber-Defense & Tech Literacy — Arm yourself with the knowledge to 
                protect your digital identity, secure your devices, and navigate the 
                digital world with confidence.
              </PillarDesc>
            </Card>
            <Card hoverable>
              <PillarIcon>🔑</PillarIcon>
              <PillarTitle>The Key</PillarTitle>
              <PillarDesc>
                Financial Engineering & Credit Repair — Unlock the secrets of credit 
                systems, learn to repair and build your financial profile, and master 
                the money game.
              </PillarDesc>
            </Card>
            <Card hoverable>
              <PillarIcon>📥</PillarIcon>
              <PillarTitle>The Download</PillarTitle>
              <PillarDesc>
                The Knowledge Base — Access our growing library of eBooks, video courses, 
                and articles designed to elevate your understanding of the systems around you.
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
