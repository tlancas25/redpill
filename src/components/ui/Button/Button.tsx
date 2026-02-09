import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${({ fullWidth }) => fullWidth && css`width: 100%;`}

  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`padding: 0.5rem 1rem; font-size: 0.75rem;`;
      case 'lg':
        return css`padding: 1rem 2rem; font-size: 1.1rem;`;
      default:
        return css`padding: 0.75rem 1.5rem; font-size: 0.875rem;`;
    }
  }}

  /* Color variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.textPrimary};
          &:hover { background: ${theme.colors.primary}; color: ${theme.colors.background}; }
        `;
      case 'accent':
        return css`
          background: ${theme.colors.accent};
          color: ${theme.colors.textPrimary};
          &:hover { opacity: 0.9; box-shadow: 0 0 15px rgba(255, 51, 51, 0.4); }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          &:hover { background: rgba(0, 255, 65, 0.1); }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover { background: ${theme.colors.primary}; color: ${theme.colors.background}; }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.background};
          &:hover { box-shadow: ${theme.shadows.glow}; transform: translateY(-1px); }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </StyledButton>
  );
};

export default Button;
