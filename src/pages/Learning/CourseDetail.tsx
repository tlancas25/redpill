import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { media } from '../../styles/breakpoints';
import { formatPrice, formatDuration } from '../../utils/helpers';

/* ── Sample course data (mirrors Learning.tsx) ── */
const sampleCourses = [
  {
    id: '1',
    title: 'Complete Cybersecurity Bootcamp',
    slug: 'cybersecurity-bootcamp',
    description: 'From zero to cyber-warrior in 30 lessons.',
    longDescription:
      'This is the ultimate cybersecurity course for beginners who want to build a rock-solid foundation in offensive and defensive security. You\'ll learn network fundamentals, Linux essentials, Wireshark packet analysis, Nmap reconnaissance, Metasploit exploitation, web application security (OWASP Top 10), password cracking, social engineering awareness, and incident response basics. Each module includes hands-on labs in a sandboxed virtual environment so you can practice safely. By the end, you\'ll be prepared to pursue CompTIA Security+ certification and start your first bug-bounty submissions.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 49.99,
    category: 'Cybersecurity',
    difficulty: 'Beginner' as const,
    totalDuration: 720,
    lessonCount: 30,
    enrolledCount: 234,
    rating: 4.8,
    curriculum: [
      { title: 'Introduction to Cybersecurity', duration: 15 },
      { title: 'Networking Fundamentals', duration: 30 },
      { title: 'Linux Command Line Essentials', duration: 25 },
      { title: 'Setting Up Your Lab Environment', duration: 20 },
      { title: 'TCP/IP Deep Dive', duration: 30 },
      { title: 'Wireshark & Packet Analysis', duration: 25 },
      { title: 'Nmap Reconnaissance Techniques', duration: 25 },
      { title: 'Vulnerability Scanning', duration: 20 },
      { title: 'Metasploit Framework Basics', duration: 30 },
      { title: 'Web Application Security (OWASP Top 10)', duration: 35 },
      { title: 'SQL Injection & XSS Attacks', duration: 25 },
      { title: 'Password Cracking & Hashing', duration: 20 },
      { title: 'Social Engineering Awareness', duration: 15 },
      { title: 'Wireless Network Security', duration: 25 },
      { title: 'Firewalls & Intrusion Detection', duration: 25 },
      { title: 'Cryptography Fundamentals', duration: 30 },
      { title: 'VPNs & Secure Communications', duration: 20 },
      { title: 'Malware Analysis Basics', duration: 25 },
      { title: 'Incident Response & Forensics', duration: 30 },
      { title: 'Building Your Security Toolkit', duration: 20 },
      { title: 'CTF Challenge Walkthrough #1', duration: 20 },
      { title: 'CTF Challenge Walkthrough #2', duration: 20 },
      { title: 'CTF Challenge Walkthrough #3', duration: 20 },
      { title: 'Bug Bounty Methodology', duration: 25 },
      { title: 'Writing Professional Reports', duration: 15 },
      { title: 'Career Paths in Cybersecurity', duration: 15 },
      { title: 'CompTIA Security+ Prep Overview', duration: 25 },
      { title: 'Practice Exam Walkthrough', duration: 30 },
      { title: 'Advanced Topics Preview', duration: 15 },
      { title: 'Final Project & Next Steps', duration: 20 },
    ],
    whatYouLearn: [
      'Network scanning and reconnaissance with Nmap',
      'Packet capture and analysis using Wireshark',
      'Web app vulnerability exploitation (SQLi, XSS, CSRF)',
      'Linux command line for security professionals',
      'Metasploit framework for penetration testing',
      'Cryptography, hashing, and secure communications',
      'Incident response and digital forensics basics',
      'Bug bounty hunting methodology',
    ],
  },
  {
    id: '2',
    title: 'Financial Sovereignty Masterclass',
    slug: 'financial-sovereignty-masterclass',
    description: 'Build unshakeable wealth, master credit, and escape the fiat trap.',
    longDescription:
      'This advanced masterclass is designed for individuals ready to take full control of their financial destiny. We cover macro-economic cycles, sound money principles, decentralized finance (DeFi), self-custody of digital assets, credit optimization strategies (800+ score blueprint), tax-efficient wealth structuring through LLCs and trusts, passive income through dividend investing and real estate syndications, and building multiple revenue streams. The course also dives into privacy-first banking, asset protection from litigation, and generational wealth transfer strategies. Every lesson is backed by real case studies and actionable spreadsheets.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 99.99,
    category: 'Financial Freedom',
    difficulty: 'Advanced' as const,
    totalDuration: 1200,
    lessonCount: 45,
    enrolledCount: 567,
    rating: 5.0,
    curriculum: [
      { title: 'The Fiat System Explained', duration: 20 },
      { title: 'Sound Money Principles', duration: 25 },
      { title: 'Macro-Economic Cycles & Timing', duration: 30 },
      { title: 'Credit Score Mastery (800+ Blueprint)', duration: 35 },
      { title: 'Debt Elimination Strategies', duration: 25 },
      { title: 'Emergency Fund & Liquidity Planning', duration: 20 },
      { title: 'Stock Market Fundamentals', duration: 30 },
      { title: 'Dividend Investing for Passive Income', duration: 25 },
      { title: 'Index Funds & ETF Strategy', duration: 25 },
      { title: 'Real Estate Investing 101', duration: 30 },
      { title: 'Real Estate Syndications & REITs', duration: 25 },
      { title: 'Starting a Cash-Flow Business', duration: 30 },
      { title: 'E-commerce & Digital Products', duration: 25 },
      { title: 'Freelancing to Agency Pipeline', duration: 20 },
      { title: 'Cryptocurrency Fundamentals', duration: 25 },
      { title: 'DeFi Yield Strategies', duration: 30 },
      { title: 'Self-Custody & Cold Storage', duration: 20 },
      { title: 'Privacy-First Banking', duration: 25 },
      { title: 'LLC Formation & Structure', duration: 25 },
      { title: 'Tax Optimization Strategies', duration: 30 },
      { title: 'Asset Protection & Trusts', duration: 25 },
      { title: 'Insurance as a Wealth Tool', duration: 20 },
      { title: 'Negotiation & Deal Making', duration: 20 },
      { title: 'Building Multiple Revenue Streams', duration: 25 },
      { title: 'Generational Wealth Transfer', duration: 25 },
      { title: 'Case Study: $0 to $100K', duration: 30 },
      { title: 'Case Study: Credit Repair Journey', duration: 25 },
      { title: 'Case Study: First Rental Property', duration: 25 },
      { title: 'International Banking & Residency', duration: 20 },
      { title: 'Gold, Silver & Commodities', duration: 20 },
      { title: 'Automation & Passive Systems', duration: 25 },
      { title: 'Risk Management Framework', duration: 20 },
      { title: 'Building a Personal Finance Dashboard', duration: 25 },
      { title: 'Mindset of the Wealthy', duration: 20 },
      { title: 'Networking for Net Worth', duration: 15 },
      { title: 'Philanthropy & Impact', duration: 15 },
      { title: 'Advanced Tax Strategies', duration: 30 },
      { title: 'Offshore Structures Overview', duration: 25 },
      { title: 'Portfolio Rebalancing Strategies', duration: 20 },
      { title: 'Bear Market Playbook', duration: 25 },
      { title: 'Bull Market Playbook', duration: 25 },
      { title: 'Retirement Planning (FIRE Method)', duration: 25 },
      { title: 'Legacy Planning & Estate', duration: 20 },
      { title: 'Course Review & Action Plan', duration: 20 },
      { title: 'Final Assessment & Certification', duration: 30 },
    ],
    whatYouLearn: [
      'Macro-economic cycles and how to time investments',
      'Credit score optimization to 800+ with proven methods',
      'DeFi, self-custody, and digital asset strategies',
      'LLC and trust structures for tax efficiency',
      'Passive income via dividends, real estate, and digital products',
      'Privacy-first banking and asset protection',
      'Building multiple revenue streams from scratch',
      'Generational wealth transfer and estate planning',
    ],
  },
  {
    id: '3',
    title: 'Biohacking for Peak Performance',
    slug: 'biohacking-peak-performance',
    description: 'Optimize your biology for maximum energy, focus, and longevity.',
    longDescription:
      'This intermediate-level course takes you through the science of human optimization. You\'ll learn evidence-based strategies for sleep optimization (circadian rhythm hacking, blue-light management), nutrition protocols (intermittent fasting, ketogenic cycling, micronutrient optimization), cold exposure and heat therapy (Wim Hof method, sauna protocols), nootropic stacking for cognitive enhancement, hormonal optimization through lifestyle interventions, HRV-guided training, breathwork techniques (Buteyko, box breathing, Wim Hof), and longevity science (senolytics, NAD+ pathways, telomere protection). Each protocol includes implementation guides with tracking templates.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 79.99,
    category: 'Biohacking',
    difficulty: 'Intermediate' as const,
    totalDuration: 600,
    lessonCount: 25,
    enrolledCount: 342,
    rating: 4.9,
    curriculum: [
      { title: 'Introduction to Biohacking', duration: 15 },
      { title: 'Circadian Rhythm & Light Exposure', duration: 25 },
      { title: 'Sleep Architecture Optimization', duration: 30 },
      { title: 'Morning Routine Engineering', duration: 20 },
      { title: 'Intermittent Fasting Protocols', duration: 25 },
      { title: 'Ketogenic Cycling Strategy', duration: 25 },
      { title: 'Micronutrient Optimization', duration: 20 },
      { title: 'Gut Microbiome Health', duration: 25 },
      { title: 'Cold Exposure & Ice Baths', duration: 25 },
      { title: 'Sauna Protocols & Heat Therapy', duration: 20 },
      { title: 'Breathwork Techniques', duration: 25 },
      { title: 'Wim Hof Method Deep Dive', duration: 25 },
      { title: 'Nootropic Stacking Fundamentals', duration: 30 },
      { title: 'Cognitive Enhancement Protocols', duration: 25 },
      { title: 'HRV-Guided Training', duration: 20 },
      { title: 'Zone 2 Cardio & VO2 Max', duration: 25 },
      { title: 'Resistance Training Optimization', duration: 25 },
      { title: 'Hormonal Health & Optimization', duration: 30 },
      { title: 'Stress Management & Adaptogens', duration: 20 },
      { title: 'Blue Light Management', duration: 15 },
      { title: 'EMF Awareness & Mitigation', duration: 15 },
      { title: 'Longevity Science (NAD+, Senolytics)', duration: 30 },
      { title: 'Tracking & Quantified Self', duration: 20 },
      { title: 'Building Your Personal Protocol', duration: 25 },
      { title: 'Course Review & Optimization Plan', duration: 20 },
    ],
    whatYouLearn: [
      'Sleep optimization and circadian rhythm hacking',
      'Intermittent fasting and ketogenic cycling protocols',
      'Cold exposure and sauna therapy science',
      'Nootropic stacking for cognitive enhancement',
      'Breathwork techniques (Wim Hof, box breathing, Buteyko)',
      'HRV-guided training and Zone 2 cardio',
      'Hormonal optimization through lifestyle interventions',
      'Longevity pathways: NAD+, senolytics, telomere protection',
    ],
  },
];

/* ── Styled Components ── */
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: 0.875rem;
  margin-bottom: 2rem;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  ${media.desktop} {
    grid-template-columns: 1fr 1fr;
  }
`;

const ThumbnailArea = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 65, 0.08) 0%,
    rgba(0, 255, 65, 0.02) 50%,
    rgba(0, 200, 50, 0.06) 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const PlayButton = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0, 255, 65, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #000;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.4);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 50px rgba(0, 255, 65, 0.6);
  }
`;

const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CategoryBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 0.75rem;
  width: fit-content;
`;

const DifficultyBadge = styled.span<{ $level: string }>`
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 0.5rem;
  background: ${({ $level }) => {
    switch ($level) {
      case 'Beginner': return 'rgba(0, 255, 65, 0.15)';
      case 'Intermediate': return 'rgba(255, 204, 0, 0.15)';
      case 'Advanced': return 'rgba(255, 51, 51, 0.15)';
      default: return 'rgba(0, 255, 65, 0.15)';
    }
  }};
  color: ${({ $level }) => {
    switch ($level) {
      case 'Beginner': return '#00ff41';
      case 'Intermediate': return '#ffcc00';
      case 'Advanced': return '#ff3333';
      default: return '#00ff41';
    }
  }};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.75rem;
  line-height: 1.2;

  ${media.tablet} {
    font-size: 2.25rem;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const MetaIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const RatingStars = styled.span`
  color: #ffcc00;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const RatingValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.code};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  margin-left: 0.25rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;

  ${media.tablet} {
    max-width: 420px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 2.5rem 0;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.35rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.25rem;
`;

const LongDescription = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

/* What You'll Learn */
const LearnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

const LearnItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CheckIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

/* Curriculum */
const CurriculumList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: module;
`;

const CurriculumItem = styled(motion.li)`
  counter-increment: module;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModuleNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 0.75rem;
  min-width: 24px;
`;

const ModuleTitle = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  flex: 1;
`;

const ModuleDuration = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.fonts.code};
  white-space: nowrap;
  margin-left: 1rem;
`;

const CTACard = styled(Card)`
  text-align: center;
  padding: 2rem;
`;

const CTAText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 1rem;
  }
`;

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

/* ── Helpers ── */
const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
};

/* ── Component ── */
const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = sampleCourses.find((c) => c.slug === slug);

  if (!course) {
    // If slug doesn't match any sample course, redirect to learning
    return <Navigate to="/learn" replace />;
  }

  const totalDuration = course.curriculum.reduce((sum, m) => sum + m.duration, 0);

  return (
    <>
      <SEOHead
        title={course.title}
        description={course.description}
        path={`/learn/course/${course.slug}`}
        keywords={[course.category, course.difficulty, course.title, 'online course']}
      />

      <Container>
        <BackLink to="/learn">← Back to Courses</BackLink>

        {/* Hero */}
        <HeroSection>
          <ThumbnailArea>
            <PlayButton>▶</PlayButton>
          </ThumbnailArea>

          <InfoArea>
            <div>
              <CategoryBadge>{course.category}</CategoryBadge>
              <DifficultyBadge $level={course.difficulty}>{course.difficulty}</DifficultyBadge>
            </div>

            <Title>{course.title}</Title>
            <Description>{course.description}</Description>

            <MetaRow>
              <MetaItem>
                <MetaIcon>📚</MetaIcon> {course.lessonCount} lessons
              </MetaItem>
              <MetaItem>
                <MetaIcon>⏱</MetaIcon> {formatDuration(totalDuration)}
              </MetaItem>
              <MetaItem>
                <MetaIcon>👥</MetaIcon> {course.enrolledCount.toLocaleString()} enrolled
              </MetaItem>
              <MetaItem>
                <RatingStars>{renderStars(course.rating)}</RatingStars>
                <RatingValue>{course.rating}</RatingValue>
              </MetaItem>
            </MetaRow>

            <PriceBlock>
              <Price>{formatPrice(course.price)}</Price>
            </PriceBlock>

            <ButtonRow>
              <Button size="lg" fullWidth>
                Enroll Now — {formatPrice(course.price)}
              </Button>
            </ButtonRow>
          </InfoArea>
        </HeroSection>

        <Divider />

        {/* About */}
        <SectionTitle>About This Course</SectionTitle>
        <LongDescription>{course.longDescription}</LongDescription>

        {/* What You'll Learn */}
        <SectionTitle>What You'll Learn</SectionTitle>
        <LearnGrid as={motion.div} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {course.whatYouLearn.map((item, i) => (
            <LearnItem key={i} variants={fadeUp}>
              <CheckIcon>✓</CheckIcon>
              {item}
            </LearnItem>
          ))}
        </LearnGrid>

        <Divider />

        {/* Curriculum */}
        <SectionTitle>Curriculum — {course.lessonCount} Lessons · {formatDuration(totalDuration)}</SectionTitle>
        <CurriculumList as={motion.ol} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {course.curriculum.map((mod, i) => (
            <CurriculumItem key={i} variants={fadeUp}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ModuleNumber>{String(i + 1).padStart(2, '0')}</ModuleNumber>
                <ModuleTitle>{mod.title}</ModuleTitle>
              </div>
              <ModuleDuration>{formatDuration(mod.duration)}</ModuleDuration>
            </CurriculumItem>
          ))}
        </CurriculumList>

        <Divider />

        {/* Bottom CTA */}
        <CTACard>
          <SectionTitle style={{ marginBottom: '0.5rem' }}>Ready to start learning?</SectionTitle>
          <CTAText>
            Get instant access to {course.title} and join {course.enrolledCount.toLocaleString()}+ students.
          </CTAText>
          <Button size="lg">
            Enroll Now — {formatPrice(course.price)}
          </Button>
        </CTACard>
      </Container>
    </>
  );
};

export default CourseDetail;
