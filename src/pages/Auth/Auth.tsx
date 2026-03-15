import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { media } from '../../styles/breakpoints';

const AuthContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const AuthCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  width: 100%;
  max-width: 440px;

  ${media.tablet} {
    padding: 3rem;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.75rem;
    text-transform: uppercase;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border: 1px solid #747775;
  border-radius: 4px;
  background: #ffffff;
  color: #1f1f1f;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.25px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: #f7f8f8;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  }

  &:active {
    background: #e8e8e8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.06 24.06 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const BottomLink = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-top: 1.5rem;

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.875rem;
  text-align: center;
  background: rgba(255, 51, 51, 0.08);
  border: 1px solid rgba(255, 51, 51, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  text-align: center;
  background: rgba(0, 255, 65, 0.08);
  border: 1px solid rgba(0, 255, 65, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
`;

const PasswordHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: -0.5rem;
`;

// ============ LOGIN ============
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { login, googleLogin, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the user after login (cart, dashboard, etc.)
  const redirectTo = (location.state as any)?.from || '/dashboard';

  // If user is already authenticated (or auth state just propagated), redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch {
      // Error handled by auth context
    }
    setFormLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate(redirectTo, { replace: true });
    } catch {
      // Error handled by auth context
    }
  };

  return (
    <>
      <SEOHead
        title="Login"
        description="Log in to your RedPillReader account to access your dashboard, library, and courses."
        path="/login"
        noindex
      />
      <AuthContainer>
        <AuthCard>
          <Title>Welcome Back</Title>
          <Subtitle>Login to access your dashboard</Subtitle>
          {error && <ErrorText>{error}</ErrorText>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" fullWidth isLoading={formLoading}>
              Login
            </Button>
          </Form>
          <Divider><span>or</span></Divider>
          <GoogleButton type="button" onClick={handleGoogle}>
            <GoogleIcon /> Sign in with Google
          </GoogleButton>
          <BottomLink>
            <Link to="/forgot-password">Forgot password?</Link>
          </BottomLink>
          <BottomLink>
            Don't have an account? <Link to="/register" state={{ from: redirectTo }}>Register</Link>
          </BottomLink>
        </AuthCard>
      </AuthContainer>
    </>
  );
};

// ============ REGISTER ============
export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, googleLogin, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as any)?.from || '/dashboard';

  // Redirect when auth state propagates (handles Google OAuth race condition)
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Password validation
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setFormError('Password must contain both letters and numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setFormLoading(true);
    try {
      await register(email, password, name);
      navigate(redirectTo, { replace: true });
    } catch {
      // Error displayed via useAuth error state
    }
    setFormLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate(redirectTo, { replace: true });
    } catch {
      // Error displayed via useAuth error state
    }
  };

  return (
    <>
      <SEOHead
        title="Register"
        description="Create your RedPillReader account to access premium courses, digital products, and member features."
        path="/register"
        noindex
      />
      <AuthContainer>
        <AuthCard>
          <Title>Take The Red Pill</Title>
          <Subtitle>Create your account</Subtitle>
          {(error || formError) && <ErrorText>{error || formError}</ErrorText>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <PasswordHint>Must be 8+ characters with letters and numbers.</PasswordHint>
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" fullWidth isLoading={formLoading}>
              Create Account
            </Button>
          </Form>
          <Divider><span>or</span></Divider>
          <GoogleButton type="button" onClick={handleGoogle}>
            <GoogleIcon /> Sign in with Google
          </GoogleButton>
          <BottomLink>
            Already have an account? <Link to="/login" state={{ from: redirectTo }}>Login</Link>
          </BottomLink>
        </AuthCard>
      </AuthContainer>
    </>
  );
};

// ============ FORGOT PASSWORD ============
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // Error handled by auth context
    }
    setFormLoading(false);
  };

  return (
    <>
      <SEOHead
        title="Forgot Password"
        description="Reset your RedPillReader account password."
        path="/forgot-password"
        noindex
      />
      <AuthContainer>
        <AuthCard>
          <Title>Reset Password</Title>
          <Subtitle>
            {!sent && 'Enter your email to receive a password reset link.'}
          </Subtitle>
          {sent && (
            <SuccessText>
              Reset link sent! Check your inbox (and spam folder) for an email from us.
            </SuccessText>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          {!sent && (
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <Button type="submit" fullWidth isLoading={formLoading}>
                Send Reset Link
              </Button>
            </Form>
          )}
          <BottomLink>
            <Link to="/login">Back to Login</Link>
          </BottomLink>
        </AuthCard>
      </AuthContainer>
    </>
  );
};
