import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GitHubUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  githubUsername: string;
  githubAvatarUrl?: string;
  githubProfileUrl?: string;
  role: string;
  subscription: {
    plan: 'free' | 'premium';
    validUntil: Date | null;
  };
  purchasedProducts: string[];
}

interface GitHubAuthContextType {
  githubUser: GitHubUser | null;
  githubRepos: any[];
  loading: boolean;
  isAuthenticated: boolean;
  loginWithGitHub: () => void;
  linkGitHubAccount: (firebaseToken: string) => Promise<void>;
  fetchGitHubRepos: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
}

const GitHubAuthContext = createContext<GitHubAuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const GitHubAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [githubUser, setGitHubUser] = useState<GitHubUser | null>(null);
  const [githubRepos, setGitHubRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token on mount and after GitHub callback
  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }

    // Check for token in URL (GitHub callback)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('github_token', urlToken);
      setIsAuthenticated(true);
      fetchUserProfile();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('github_token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        setGitHubUser(user);
        setIsAuthenticated(true);
      } else {
        // Token invalid
        localStorage.removeItem('github_token');
        setIsAuthenticated(false);
        setGitHubUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch GitHub user:', error);
      localStorage.removeItem('github_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGitHub = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/auth/github`;
  };

  const linkGitHubAccount = async (firebaseToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/link-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });
      
      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = `${API_URL}${data.redirectUrl}`;
      }
    } catch (error) {
      console.error('Failed to link GitHub:', error);
    }
  };

  const fetchGitHubRepos = async () => {
    const token = localStorage.getItem('github_token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/github/repos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const repos = await response.json();
        setGitHubRepos(repos);
      }
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setGitHubUser(null);
    setIsAuthenticated(false);
    setGitHubRepos([]);
  };

  return (
    <GitHubAuthContext.Provider
      value={{
        githubUser,
        githubRepos,
        loading,
        isAuthenticated,
        loginWithGitHub,
        linkGitHubAccount,
        fetchGitHubRepos,
        fetchUserProfile,
        logout,
      }}
    >
      {children}
    </GitHubAuthContext.Provider>
  );
};

export const useGitHubAuth = (): GitHubAuthContextType => {
  const context = useContext(GitHubAuthContext);
  if (!context) {
    throw new Error('useGitHubAuth must be used within GitHubAuthProvider');
  }
  return context;
};
