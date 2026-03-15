import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { media } from '../../styles/breakpoints';

/* ── Styled Components ── */

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  ${media.tablet} {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  text-align: center;
  background: rgba(0, 255, 65, 0.08);
  border: 1px solid rgba(0, 255, 65, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.875rem;
  text-align: center;
  background: rgba(255, 51, 51, 0.08);
  border: 1px solid rgba(255, 51, 51, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
`;

const DangerZone = styled(Section)`
  border-color: rgba(255, 51, 51, 0.3);
`;

const DangerTitle = styled(SectionTitle)`
  color: ${({ theme }) => theme.colors.accent};
`;

const DangerText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ConfirmInput = styled.div`
  margin-bottom: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Badge = styled.span`
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 255, 65, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(0, 255, 65, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ── Component ── */

const Settings: React.FC = () => {
  const {
    user,
    userProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || user?.displayName || ''
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';
  const memberSince = userProfile?.createdAt
    ? new Date(
        (userProfile.createdAt as any)?.seconds
          ? (userProfile.createdAt as any).seconds * 1000
          : userProfile.createdAt
      ).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!displayName.trim()) {
      setProfileError('Display name cannot be empty.');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      setProfileSuccess('Profile updated successfully.');
    } catch {
      setProfileError('Failed to update profile. Please try again.');
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordError('New password must contain both letters and numbers.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      setPasswordError('Failed to change password. Check your current password and try again.');
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch {
      setDeleteError(
        'Failed to delete account. You may need to sign in again before deleting.'
      );
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <SEOHead
        title="Settings"
        description="Manage your RedPillReader account settings, profile, and preferences."
        path="/settings"
        noindex
      />

      <SettingsContainer>
        <PageTitle>Account Settings</PageTitle>
        <PageSubtitle>Manage your profile, security, and data.</PageSubtitle>

        {/* ── Account Info ── */}
        <Section>
          <SectionTitle>Account Overview</SectionTitle>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user?.email || 'N/A'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Sign-in Method</InfoLabel>
            <InfoValue>
              {isGoogleUser ? 'Google' : 'Email & Password'}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Member Since</InfoLabel>
            <InfoValue>{memberSince}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Plan</InfoLabel>
            <InfoValue>
              <Badge>{userProfile?.subscription?.plan || 'free'}</Badge>
            </InfoValue>
          </InfoRow>
        </Section>

        {/* ── Edit Profile ── */}
        <Section>
          <SectionTitle>Edit Profile</SectionTitle>
          {profileSuccess && <SuccessText>{profileSuccess}</SuccessText>}
          {profileError && <ErrorText>{profileError}</ErrorText>}
          <Form onSubmit={handleProfileUpdate}>
            <FormRow>
              <Input
                type="text"
                label="Display Name"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
                required
              />
              <Input
                type="email"
                label="Email"
                placeholder={user?.email || ''}
                value={user?.email || ''}
                onChange={() => {}}
                fullWidth
                disabled
              />
            </FormRow>
            <ButtonRow>
              <Button type="submit" isLoading={profileLoading}>
                Save Changes
              </Button>
            </ButtonRow>
          </Form>
        </Section>

        {/* ── Change Password (email users only) ── */}
        {!isGoogleUser && (
          <Section>
            <SectionTitle>Change Password</SectionTitle>
            {passwordSuccess && <SuccessText>{passwordSuccess}</SuccessText>}
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
            <Form onSubmit={handlePasswordChange}>
              <Input
                type="password"
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
              />
              <FormRow>
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  fullWidth
                  required
                />
              </FormRow>
              <ButtonRow>
                <Button type="submit" isLoading={passwordLoading}>
                  Update Password
                </Button>
              </ButtonRow>
            </Form>
          </Section>
        )}

        {/* ── Danger Zone ── */}
        <DangerZone>
          <DangerTitle>Danger Zone</DangerTitle>
          <DangerText>
            Permanently delete your account and all associated data including
            purchase history, course progress, and saved articles. This action
            cannot be undone.
          </DangerText>
          {deleteError && <ErrorText>{deleteError}</ErrorText>}
          <ConfirmInput>
            <Input
              type="text"
              label='Type "DELETE" to confirm'
              placeholder="DELETE"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              fullWidth
            />
          </ConfirmInput>
          <ButtonRow>
            <Button
              variant="outline"
              type="button"
              isLoading={deleteLoading}
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </Button>
          </ButtonRow>
        </DangerZone>

        {/* ── Logout ── */}
        <ButtonRow>
          <Button
            variant="outline"
            type="button"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            Sign Out
          </Button>
        </ButtonRow>
      </SettingsContainer>
    </>
  );
};

export default Settings;
