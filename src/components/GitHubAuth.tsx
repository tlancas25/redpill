import React from 'react';
import { useGitHubAuth } from '../context/GitHubAuthContext';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #24292e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1b1f23;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #24292e;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f6f8fa;
    border-color: #24292e;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const SmallAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const RepoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RepoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f6f8fa;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
`;

const GitHubIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export const GitHubLoginButton: React.FC = () => {
  const { githubUser, loading, loginWithGitHub } = useGitHubAuth();

  if (loading) {
    return (
      <Button disabled>
        <GitHubIcon />
        Connecting...
      </Button>
    );
  }

  if (githubUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SmallAvatar src={githubUser.githubAvatarUrl} alt={githubUser.githubUsername} />
        <span style={{ fontSize: '0.875rem', color: '#586069' }}>
          @{githubUser.githubUsername}
        </span>
      </div>
    );
  }

  return (
    <Button onClick={loginWithGitHub}>
      <GitHubIcon />
      Login with GitHub
    </Button>
  );
};

export const GitHubProfileCard: React.FC = () => {
  const { githubUser } = useGitHubAuth();

  if (!githubUser) return null;

  return (
    <ProfileCard>
      <Avatar src={githubUser.githubAvatarUrl} alt={githubUser.displayName} />
      <div>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{githubUser.displayName}</h3>
        <p style={{ margin: '0.25rem 0', color: '#586069' }}>
          @{githubUser.githubUsername}
        </p>
        <a
          href={githubUser.githubProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.875rem', color: '#0366d6' }}
        >
          View on GitHub →
        </a>
      </div>
    </ProfileCard>
  );
};

export const GitHubRepoList: React.FC = () => {
  const { githubRepos, fetchGitHubRepos, loading } = useGitHubAuth();

  React.useEffect(() => {
    fetchGitHubRepos();
  }, []);

  if (loading) return <div>Loading repositories...</div>;

  if (githubRepos.length === 0) {
    return <div>No public repositories found.</div>;
  }

  return (
    <RepoList>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Your Repositories</h3>
      {githubRepos.map((repo: any) => (
        <RepoItem key={repo.id}>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 500, color: '#0366d6' }}
          >
            {repo.name}
          </a>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#586069' }}>
            <span>⭐ {repo.stargazersCount}</span>
            <span>{repo.language || 'N/A'}</span>
          </div>
        </RepoItem>
      ))}
    </RepoList>
  );
};

interface LinkGitHubButtonProps {
  firebaseToken: string;
}

export const LinkGitHubButton: React.FC<LinkGitHubButtonProps> = ({ firebaseToken }) => {
  const { githubUser, linkGitHubAccount, loading } = useGitHubAuth();

  if (githubUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#28a745', fontSize: '0.875rem' }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Linked to @{githubUser.githubUsername}
      </div>
    );
  }

  return (
    <OutlineButton
      onClick={() => linkGitHubAccount(firebaseToken)}
      disabled={loading}
    >
      <GitHubIcon />
      {loading ? 'Linking...' : 'Link GitHub Account'}
    </OutlineButton>
  );
};

export const GitHubLogoutButton: React.FC = () => {
  const { logout } = useGitHubAuth();

  return (
    <OutlineButton onClick={logout}>
      Disconnect GitHub
    </OutlineButton>
  );
};
