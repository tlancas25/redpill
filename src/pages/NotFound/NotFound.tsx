import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';

const NotFoundContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const GlitchText = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 6rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glowStrong};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const LinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const NotFound: React.FC = () => {
  return (
    <>
      <SEOHead title="404 - Page Not Found" />
      <NotFoundContainer>
        <GlitchText
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </GlitchText>
        <Title>You've Found a Glitch in the Matrix</Title>
        <Message>
          The page you're looking for doesn't exist or has been moved to another dimension.
        </Message>
        <LinksRow>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/store">
            <Button variant="outline">Browse Store</Button>
          </Link>
          <Link to="/blog">
            <Button variant="ghost">Read Blog</Button>
          </Link>
        </LinksRow>
      </NotFoundContainer>
    </>
  );
};

export default NotFound;
