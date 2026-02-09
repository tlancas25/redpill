import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const LoaderWrapper = styled.div<{ $fullPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  ${({ $fullPage }) =>
    $fullPage &&
    `
    min-height: 100vh;
    width: 100%;
  `}
`;

const Dots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const LoaderText = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullPage = false, text = 'Loading...' }) => {
  return (
    <LoaderWrapper $fullPage={fullPage}>
      <Dots>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </Dots>
      <LoaderText>{text}</LoaderText>
    </LoaderWrapper>
  );
};

export default Loader;
