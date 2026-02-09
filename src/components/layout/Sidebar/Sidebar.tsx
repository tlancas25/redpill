import React from 'react';
import styled from 'styled-components';
import { media } from '../../../styles/breakpoints';

const SidebarContainer = styled.aside<{ $isOpen?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  width: 280px;
  min-height: calc(100vh - 70px);

  ${media.desktop} {
    display: block;
  }

  @media (max-width: 1023px) {
    position: fixed;
    top: 70px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-280px')};
    z-index: 100;
    transition: left 0.3s ease;
    box-shadow: ${({ $isOpen }) => ($isOpen ? '4px 0 15px rgba(0,0,0,0.5)' : 'none')};
  }
`;

interface SidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, isOpen }) => {
  return <SidebarContainer $isOpen={isOpen}>{children}</SidebarContainer>;
};

export default Sidebar;
