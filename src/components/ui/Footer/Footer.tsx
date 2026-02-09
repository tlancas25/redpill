import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { APP_NAME, APP_TAGLINE, SOCIAL_LINKS } from '../../../utils/constants';
import { media } from '../../../styles/breakpoints';
import Button from '../Button';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 3rem 1rem 1.5rem;
  margin-top: auto;

  ${media.tablet} {
    padding: 4rem 2rem 1.5rem;
  }
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-block;
  margin-bottom: 1rem;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ColumnTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.25rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NewsletterInput = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const BackToTop = styled.button`
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    setEmail('');
    alert('Thanks for subscribing!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterContainer>
      <FooterInner>
        <FooterGrid>
          {/* Column 1: Brand */}
          <FooterColumn>
            <FooterLogo to="/">
              <span>RED</span>PILL<span>READER</span>
            </FooterLogo>
            <Tagline>{APP_TAGLINE}</Tagline>
            <SocialLinks>
              <SocialLink href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer">
                𝕏
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
                ▶
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                💬
              </SocialLink>
            </SocialLinks>
          </FooterColumn>

          {/* Column 2: Quick Links */}
          <FooterColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <FooterLink to="/store">Store</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/learn">Learning Center</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
          </FooterColumn>

          {/* Column 3: Legal */}
          <FooterColumn>
            <ColumnTitle>Legal</ColumnTitle>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
            <FooterLink to="/refund-policy">Refund Policy</FooterLink>
            <FooterLink to="/cookie-policy">Cookie Policy</FooterLink>
          </FooterColumn>

          {/* Column 4: Newsletter */}
          <FooterColumn>
            <ColumnTitle>Stay Connected</ColumnTitle>
            <Tagline>Get the latest insights delivered to your inbox.</Tagline>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="sm" fullWidth>
                Subscribe
              </Button>
            </NewsletterForm>
          </FooterColumn>
        </FooterGrid>

        <BottomBar>
          <Copyright>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Copyright>
          <BackToTop onClick={scrollToTop}>↑ Back to Top</BackToTop>
        </BottomBar>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
