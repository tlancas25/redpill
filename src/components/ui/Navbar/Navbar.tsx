import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { NAV_LINKS, APP_NAME } from '../../../utils/constants';
import { media } from '../../../styles/breakpoints';

const NavContainer = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: ${({ $scrolled, theme }) =>
    $scrolled ? 'rgba(13, 13, 13, 0.95)' : 'rgba(13, 13, 13, 0.8)'};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ $scrolled, theme }) =>
    $scrolled ? theme.colors.border : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const NavInner = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  ${media.tablet} {
    padding: 1rem 2rem;
  }
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  letter-spacing: 2px;
  text-shadow: ${({ theme }) => theme.shadows.glow};

  span {
    color: ${({ theme }) => theme.colors.accent};
  }

  ${media.tablet} {
    font-size: 1.5rem;
  }
`;

const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;

  ${media.desktop} {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.875rem;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.normal};
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartButton = styled(Link)`
  position: relative;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthButton = styled(Link)`
  display: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.glow};
    color: ${({ theme }) => theme.colors.background};
  }

  ${media.tablet} {
    display: inline-flex;
  }
`;

const HamburgerButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: 4px;

  ${media.desktop} {
    display: none;
  }

  span {
    width: 24px;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 13, 13, 0.98);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const MobileNavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 2rem;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <NavContainer $scrolled={scrolled}>
        <NavInner>
          <Logo to="/">
            <span>RED</span>PILL<span>READER</span>
          </Logo>

          <DesktopNav>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                $active={location.pathname.startsWith(link.path)}
              >
                {link.label}
              </NavLink>
            ))}
          </DesktopNav>

          <NavActions>
            <CartButton to="/cart">
              🛒
              {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
            </CartButton>
            {isAuthenticated ? (
              <AuthButton to="/dashboard">Dashboard</AuthButton>
            ) : (
              <AuthButton to="/login">Login</AuthButton>
            )}
            <HamburgerButton onClick={() => setMobileOpen(true)}>
              <span />
              <span />
              <span />
            </HamburgerButton>
          </NavActions>
        </NavInner>
      </NavContainer>

      <AnimatePresence>
        {mobileOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MobileClose onClick={() => setMobileOpen(false)}>&times;</MobileClose>
            {NAV_LINKS.map((link) => (
              <MobileNavLink key={link.path} to={link.path}>
                {link.label}
              </MobileNavLink>
            ))}
            <MobileNavLink to="/cart">Cart {itemCount > 0 && `(${itemCount})`}</MobileNavLink>
            {isAuthenticated ? (
              <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/register">Register</MobileNavLink>
              </>
            )}
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
