import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: string;
  onClick?: () => void;
}

const StyledCard = styled.div<{ $hoverable?: boolean; $padding?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $padding }) => $padding || '1.5rem'};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    cursor: pointer;
    &:hover {
      border-color: ${theme.colors.primary};
      box-shadow: ${theme.shadows.glow};
      transform: translateY(-4px);
    }
  `}
`;

const Card: React.FC<CardProps> = ({ children, hoverable, padding, onClick }) => {
  return (
    <StyledCard $hoverable={hoverable} $padding={padding} onClick={onClick}>
      {children}
    </StyledCard>
  );
};

export default Card;
