import { useAuthContext } from '../context/AuthContext';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
} from '../services/auth';

/**
 * Map Firebase error codes to user-friendly messages
 */
const getFirebaseErrorMessage = (err: any): string => {
  const code = err?.code || '';
  switch (code) {
    // Login errors
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support for help.';

    // Registration errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 8 characters with a mix of letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    // Google OAuth errors
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
    case 'auth/cancelled-popup-request':
      return ''; // Silent — user just closed it
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';

    // Password reset errors
    case 'auth/missing-email':
      return 'Please enter your email address.';

    // Firebase not configured
    default:
      if (err?.message?.includes('not configured') || err?.message?.includes('Firebase')) {
        return 'Authentication service is not available right now. Please try again later.';
      }
      return err?.message || 'Something went wrong. Please try again.';
  }
};

export const useAuth = () => {
  const { user, userProfile, loading, error, setError } = useAuthContext();

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      await loginWithEmail(email, password);
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
      throw err;
    }
  };

  const handleRegister = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      await registerWithEmail(email, password, displayName);
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
      throw err;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear any GitHub auth tokens on logout
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_user');
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
      throw err;
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    isAuthenticated: !!user,
  };
};
