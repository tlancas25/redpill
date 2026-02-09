import React from 'react';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import { media } from '../../styles/breakpoints';
import { SUPPORT_EMAIL } from '../../utils/constants';

const LegalContainer = styled.div`
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
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LastUpdated = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
  line-height: 1.8;
  margin-bottom: 0.75rem;
`;

const List = styled.ul`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
  line-height: 1.8;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
`;

// ============ PRIVACY POLICY ============
export const PrivacyPolicyPage: React.FC = () => (
  <>
    <SEOHead title="Privacy Policy" />
    <LegalContainer>
      <PageTitle>Privacy Policy</PageTitle>
      <LastUpdated>Last updated: February 9, 2026</LastUpdated>

      <Section>
        <SectionTitle>1. Information We Collect</SectionTitle>
        <Text>We collect information you provide directly, including name, email address, and payment information when you create an account or make a purchase.</Text>
        <List>
          <li>Account information (name, email, password)</li>
          <li>Payment and billing information (processed securely by Stripe)</li>
          <li>Course progress and learning activity</li>
          <li>Usage data and analytics</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <Text>We use your information to provide, maintain, and improve our services, process transactions, send communications, and personalize your experience.</Text>
      </Section>

      <Section>
        <SectionTitle>3. Data Storage & Security</SectionTitle>
        <Text>We use Firebase (Google Cloud) for data storage and implement industry-standard security measures to protect your information. Payment data is processed and stored securely by Stripe — we never store your full card details.</Text>
      </Section>

      <Section>
        <SectionTitle>4. Third-Party Services</SectionTitle>
        <Text>We use the following third-party services: Stripe (payments), Firebase/Google Cloud (authentication and data), and analytics services. Each has their own privacy policies.</Text>
      </Section>

      <Section>
        <SectionTitle>5. Your Rights</SectionTitle>
        <Text>You have the right to access, correct, or delete your personal data. Contact us at {SUPPORT_EMAIL} for any privacy-related requests.</Text>
      </Section>

      <Section>
        <SectionTitle>6. Cookies</SectionTitle>
        <Text>We use essential cookies for authentication and preferences, and analytics cookies to understand usage patterns. See our Cookie Policy for details.</Text>
      </Section>

      <Section>
        <SectionTitle>7. Contact</SectionTitle>
        <Text>For privacy concerns, contact us at {SUPPORT_EMAIL}.</Text>
      </Section>
    </LegalContainer>
  </>
);

// ============ TERMS OF SERVICE ============
export const TermsOfServicePage: React.FC = () => (
  <>
    <SEOHead title="Terms of Service" />
    <LegalContainer>
      <PageTitle>Terms of Service</PageTitle>
      <LastUpdated>Last updated: February 9, 2026</LastUpdated>

      <Section>
        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Text>By accessing and using RedPillReader.com, you accept and agree to be bound by these Terms of Service. If you do not agree, do not use our services.</Text>
      </Section>

      <Section>
        <SectionTitle>2. User Accounts</SectionTitle>
        <Text>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information when creating an account.</Text>
      </Section>

      <Section>
        <SectionTitle>3. Purchases & Payments</SectionTitle>
        <Text>All purchases are processed securely through Stripe. Prices are in USD unless otherwise stated. You agree to pay all charges associated with your purchases.</Text>
      </Section>

      <Section>
        <SectionTitle>4. Digital Product Delivery</SectionTitle>
        <Text>eBooks and course access are delivered digitally through your account dashboard immediately after successful payment. Access is granted to the registered account holder only.</Text>
      </Section>

      <Section>
        <SectionTitle>5. Intellectual Property</SectionTitle>
        <Text>All content on RedPillReader.com, including text, graphics, videos, and courses, is owned by or licensed to RedPillReader and protected by copyright laws. Unauthorized reproduction is prohibited.</Text>
      </Section>

      <Section>
        <SectionTitle>6. User Conduct</SectionTitle>
        <Text>You agree not to share, redistribute, or resell any purchased content. You agree not to attempt to gain unauthorized access to our systems.</Text>
      </Section>

      <Section>
        <SectionTitle>7. Limitation of Liability</SectionTitle>
        <Text>RedPillReader provides content for educational purposes only. We are not liable for any direct, indirect, or consequential damages arising from your use of our services.</Text>
      </Section>

      <Section>
        <SectionTitle>8. Contact</SectionTitle>
        <Text>Questions about these terms? Contact us at {SUPPORT_EMAIL}.</Text>
      </Section>
    </LegalContainer>
  </>
);

// ============ REFUND POLICY ============
export const RefundPolicyPage: React.FC = () => (
  <>
    <SEOHead title="Refund Policy" />
    <LegalContainer>
      <PageTitle>Refund Policy</PageTitle>
      <LastUpdated>Last updated: February 9, 2026</LastUpdated>

      <Section>
        <SectionTitle>30-Day Money-Back Guarantee</SectionTitle>
        <Text>We want you to be completely satisfied. If you're unhappy with a purchase, you may request a full refund within 30 days of purchase.</Text>
      </Section>

      <Section>
        <SectionTitle>Conditions for Refund</SectionTitle>
        <List>
          <li>Refund must be requested within 30 days of the original purchase date</li>
          <li>The product must not have been substantially consumed (e.g., more than 50% of a course completed)</li>
          <li>Refund requests must be submitted via email to {SUPPORT_EMAIL}</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>How to Request a Refund</SectionTitle>
        <Text>Send an email to {SUPPORT_EMAIL} with your order ID and reason for the refund. We'll process your request within 5-7 business days.</Text>
      </Section>

      <Section>
        <SectionTitle>Processing Time</SectionTitle>
        <Text>Refunds are processed back to the original payment method within 5-10 business days after approval.</Text>
      </Section>
    </LegalContainer>
  </>
);

// ============ COOKIE POLICY ============
export const CookiePolicyPage: React.FC = () => (
  <>
    <SEOHead title="Cookie Policy" />
    <LegalContainer>
      <PageTitle>Cookie Policy</PageTitle>
      <LastUpdated>Last updated: February 9, 2026</LastUpdated>

      <Section>
        <SectionTitle>What Are Cookies</SectionTitle>
        <Text>Cookies are small text files stored on your device when you visit a website. They help us provide you with a better experience.</Text>
      </Section>

      <Section>
        <SectionTitle>Cookies We Use</SectionTitle>
        <List>
          <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
          <li><strong>Preference Cookies:</strong> Remember your settings like cart items and theme preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you use our site to improve it</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>Managing Cookies</SectionTitle>
        <Text>You can control cookies through your browser settings. Note that disabling essential cookies may affect site functionality.</Text>
      </Section>

      <Section>
        <SectionTitle>Third-Party Cookies</SectionTitle>
        <Text>Our site may include cookies from third-party services like Google Analytics and Stripe for payment processing.</Text>
      </Section>
    </LegalContainer>
  </>
);
