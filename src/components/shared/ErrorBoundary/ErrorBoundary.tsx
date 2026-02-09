import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #ff4444;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #b3b3b3;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  background: #00ff41;
  color: #0d0d0d;
  font-family: 'Orbitron', sans-serif;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border: none;

  &:hover {
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorWrapper>
          <ErrorTitle>⚠ System Error Detected</ErrorTitle>
          <ErrorMessage>
            Something went wrong. The Matrix has a glitch.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Reload System
          </RetryButton>
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
