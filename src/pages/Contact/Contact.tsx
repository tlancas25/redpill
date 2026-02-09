import React, { useState } from 'react';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { media } from '../../styles/breakpoints';
import { CONTACT_SUBJECTS, SUPPORT_EMAIL } from '../../utils/constants';

const ContactContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.tablet} {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
`;

const InfoTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const FAQSection = styled.section`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const AccordionItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

const AccordionHeader = styled.button<{ $open: boolean }>`
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${({ $open, theme }) =>
    $open ? 'rgba(0, 255, 65, 0.05)' : theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(0, 255, 65, 0.05);
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.2s;
  }
`;

const AccordionBody = styled.div<{ $open: boolean }>`
  max-height: ${({ $open }) => ($open ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AccordionContent = styled.p`
  padding: 0 1.25rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.7;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.success};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const faqs = [
  { q: 'How do I access my purchased courses?', a: 'After purchase, courses appear in your Dashboard under "My Library". You can start watching immediately.' },
  { q: 'What is your refund policy?', a: 'We offer a 30-day money-back guarantee on all digital products. Contact support to request a refund.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within minutes.' },
  { q: 'Do you offer discounts?', a: 'We periodically run promotions and offer bundle discounts. Subscribe to our newsletter to stay informed.' },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <SEOHead title="Contact Us" description="Get in touch with the RedPillReader team. Questions, feedback, or support." />

      <ContactContainer>
        <PageTitle>Connect With Us</PageTitle>
        <PageSubtitle>Questions? Feedback? We're listening.</PageSubtitle>

        <Grid>
          <div>
            {submitted ? (
              <SuccessMessage>
                <h3>Message Sent ✓</h3>
                <p>We'll get back to you within 24 hours.</p>
              </SuccessMessage>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                />
                <div>
                  <Label>Subject</Label>
                  <Select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <option value="">Select a subject</option>
                    {CONTACT_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Message</Label>
                  <TextArea
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" fullWidth isLoading={loading}>
                  Send Message
                </Button>
              </Form>
            )}
          </div>

          <div>
            <Card>
              <InfoTitle>Contact Info</InfoTitle>
              <InfoText>📧 {SUPPORT_EMAIL}</InfoText>
              <InfoText>⏱ We typically respond within 24 hours.</InfoText>
            </Card>
          </div>
        </Grid>

        <FAQSection>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          {faqs.map((faq, i) => (
            <AccordionItem key={i}>
              <AccordionHeader
                $open={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span>▼</span>
              </AccordionHeader>
              <AccordionBody $open={openFaq === i}>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionBody>
            </AccordionItem>
          ))}
        </FAQSection>
      </ContactContainer>
    </>
  );
};

export default Contact;
