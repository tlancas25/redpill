import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { media } from '../../styles/breakpoints';
import { APP_NAME } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
import { productsAPI } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { articles } from '../../data/articles';
import { Product } from '../../types';

// ==================== Matrix Rain Canvas ====================
const MatrixCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.12;
  z-index: 0;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

// ==================== Glitch Keyframes ====================
const glitchAnim1 = keyframes`
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, -1px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, 2px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(3px, 1px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-3px, -2px); }
  100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, 0); }
`;

const glitchAnim2 = keyframes`
  0% { clip-path: inset(65% 0 13% 0); transform: translate(3px, 1px); }
  20% { clip-path: inset(15% 0 63% 0); transform: translate(-1px, -3px); }
  40% { clip-path: inset(82% 0 2% 0); transform: translate(2px, -1px); }
  60% { clip-path: inset(33% 0 50% 0); transform: translate(-2px, 2px); }
  80% { clip-path: inset(1% 0 88% 0); transform: translate(1px, -2px); }
  100% { clip-path: inset(47% 0 35% 0); transform: translate(-3px, 1px); }
`;

// ==================== Hero Styles ====================
const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(0, 255, 65, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow};
  margin-bottom: 1.5rem;
  line-height: 1.1;
  position: relative;
  display: inline-block;

  ${media.tablet} {
    font-size: 3.5rem;
  }

  ${media.desktop} {
    font-size: 4.5rem;
  }

  span {
    color: ${({ theme }) => theme.colors.accent};
  }

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &::before {
    color: ${({ theme }) => theme.colors.accent};
    animation: ${glitchAnim1} 4s infinite linear alternate-reverse;
    opacity: 0.7;
  }

  &::after {
    color: ${({ theme }) => theme.colors.primary};
    animation: ${glitchAnim2} 3s infinite linear alternate-reverse;
    opacity: 0.7;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before, &::after {
      animation: none;
      display: none;
    }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.8;

  ${media.tablet} {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  ${media.tablet} {
    flex-direction: row;
    justify-content: center;
  }
`;

// ==================== Stats Section ====================
const StatsSection = styled.section`
  padding: 4rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${media.tablet} {
    padding: 5rem 2rem;
  }
`;

const StatsGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  ${media.tablet} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow};
  line-height: 1;
  margin-bottom: 0.5rem;

  ${media.tablet} {
    font-size: 3rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

// ==================== Shared Section Styles ====================
const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.7;
  font-size: 0.95rem;
`;

// ==================== Features Section ====================
const FeaturesSection = styled.section`
  padding: 5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.7;
`;

// ==================== Featured Products Section ====================
const ProductsSection = styled.section`
  padding: 5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const ProductsInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.mobileLg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductImagePlaceholder = styled.div<{ $type: string }>`
  width: 100%;
  height: 180px;
  background: ${({ $type }) =>
    $type === 'course'
      ? 'linear-gradient(135deg, rgba(0, 255, 65, 0.08) 0%, rgba(0, 143, 17, 0.18) 100%)'
      : 'linear-gradient(135deg, rgba(255, 51, 51, 0.08) 0%, rgba(255, 204, 0, 0.12) 100%)'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid rgba(0, 255, 65, 0.1);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ProductTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const ProductDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const ProductPrice = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
`;

const ViewAllLink = styled.div`
  text-align: center;
  margin-top: 2.5rem;
`;

// ==================== Latest Articles Section ====================
const ArticlesSection = styled.section`
  padding: 5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const ArticlesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ArticleImage = styled.div`
  width: 100%;
  height: 180px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ArticleCategoryBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ArticleTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95rem;
  margin: 0.75rem 0 0.5rem;
`;

const ArticleExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ==================== Testimonials Section ====================
const TestimonialsSection = styled.section`
  padding: 5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at bottom, rgba(0, 255, 65, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const TestimonialsInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const TestimonialsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.75rem;
  position: relative;
`;

const TestimonialQuote = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 1.25rem;

  &::before {
    content: '"';
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.heading};
    line-height: 0;
    vertical-align: -0.4em;
    margin-right: 0.15rem;
  }
`;

const TestimonialFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TestimonialAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.background};
  font-weight: 700;
  flex-shrink: 0;
`;

const TestimonialAuthorInfo = styled.div`
  flex: 1;
`;

const TestimonialAuthorName = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.8rem;
  letter-spacing: 0.5px;
`;

const TestimonialAuthorRole = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.7rem;
`;

const TestimonialStars = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

// ==================== CTA Section ====================
const CTASection = styled.section`
  padding: 5rem 1rem;
  text-align: center;

  ${media.tablet} {
    padding: 6rem 2rem;
  }
`;

const CTAText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.8;
`;

// ==================== Animation Variants ====================
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ==================== Testimonials Data ====================
const TESTIMONIALS = [
  {
    quote: "The AI Agents course changed how I think about automation entirely. Built my first autonomous agent within a week and it's already handling client onboarding.",
    author: 'Marcus R.',
    role: 'Freelance Developer',
    rating: 5,
    initials: 'MR',
  },
  {
    quote: "Finally, content that doesn't sugarcoat reality. The wealth creation articles gave me a framework I actually use, not just motivational fluff.",
    author: 'Tanya K.',
    role: 'E-commerce Founder',
    rating: 5,
    initials: 'TK',
  },
  {
    quote: "The privacy tools guide alone was worth it. Cleaned up my entire digital footprint in one weekend. The cybersecurity ebook goes deep without being overwhelming.",
    author: 'Jordan L.',
    role: 'Security Analyst',
    rating: 5,
    initials: 'JL',
  },
];

// ==================== Count-Up Hook ====================
const useCountUp = (target: number, duration: number = 2000, isDecimal: boolean = false) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = isDecimal
        ? Math.round(eased * target * 10) / 10
        : Math.round(eased * target);
      setCount(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration, isDecimal]);

  return { count, ref };
};

// ==================== Matrix Rain Hook ====================
const useMatrixRain = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationId: number;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
      ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    // Slower frame rate for performance
    let lastTime = 0;
    const fps = 15;
    const interval = 1000 / fps;

    const throttledDraw = (time: number) => {
      animationId = requestAnimationFrame(throttledDraw);
      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationId = requestAnimationFrame(throttledDraw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
};

// ==================== Stats Data ====================
const STATS = [
  { target: 15, suffix: '+', label: 'Premium Courses', isDecimal: false },
  { target: 50, suffix: '+', label: 'In-Depth Articles', isDecimal: false },
  { target: 2000, suffix: '+', label: 'Students', isDecimal: false },
  { target: 4.9, suffix: '', label: 'Avg Rating', isDecimal: true },
];

// ==================== Stat Counter Component ====================
const StatCounter: React.FC<{ target: number; suffix: string; label: string; isDecimal: boolean }> = ({
  target,
  suffix,
  label,
  isDecimal,
}) => {
  const { count, ref } = useCountUp(target, 2000, isDecimal);
  return (
    <StatItem ref={ref}>
      <StatNumber>
        {isDecimal ? count.toFixed(1) : count.toLocaleString()}
        {suffix}
      </StatNumber>
      <StatLabel>{label}</StatLabel>
    </StatItem>
  );
};

// ==================== Section Wrapper ====================
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

// ==================== Home Component ====================
const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useMatrixRain(canvasRef);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await productsAPI.getFeatured();
        const products = response.data.products || response.data || [];
        setFeaturedProducts(Array.isArray(products) ? products.slice(0, 4) : []);
      } catch {
        // Silent fallback - section just won't render
      }
    };
    loadFeatured();
  }, []);

  const handleBuyNow = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      window.location.href = '/checkout';
    },
    [addToCart]
  );

  const latestArticles = articles.slice(0, 3);
  const starString = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <>
      <SEOHead
        title="Decode the System"
        description={`${APP_NAME} helps you master health, wealth, mindset, survival, and digital sovereignty through premium courses, articles, and digital products.`}
        path="/"
        keywords={['red pill', 'self-improvement', 'biohacking', 'wealth creation', 'mindset', 'digital sovereignty']}
      />

      {/* Hero */}
      <HeroSection>
        <MatrixCanvas ref={canvasRef} />
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle data-text="TAKE THE RED PILL">
            TAKE THE <span>RED</span> PILL
          </HeroTitle>
          <HeroSubtitle>
            Break free from the constraints of the matrix. Master your health,
            wealth, and mind. Decode the system and reclaim your sovereignty.
          </HeroSubtitle>
          <HeroButtons>
            <Link to="/store">
              <Button size="lg">Browse Store</Button>
            </Link>
            <Link to="/learn">
              <Button variant="outline" size="lg">
                Start Learning
              </Button>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Stats */}
      <StatsSection>
        <StatsGrid>
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </StatsGrid>
      </StatsSection>

      {/* Features */}
      <FeaturesSection>
        <AnimatedSection>
          <SectionTitle>Your Path to Sovereignty</SectionTitle>
          <SectionSubtitle>
            Four pillars to break free and build an unshakeable life on your own terms.
          </SectionSubtitle>
        </AnimatedSection>
        <FeaturesGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {[
            { icon: '🧬', title: 'Biohacking & Health', desc: 'Optimize your biology. Escape the sick-care system. Master nutrition, fitness, and longevity to build an unshakeable vessel.' },
            { icon: '💰', title: 'Wealth Creation', desc: 'Escape the rat race. Learn financial engineering, credit mastery, and sovereign wealth strategies to buy your freedom.' },
            { icon: '🧠', title: 'Mindset & Psychology', desc: 'Reprogram your mind. Break limiting beliefs, master social dynamics, and develop the mental fortitude of a sovereign individual.' },
            { icon: '🛡️', title: 'Tech & Security', desc: 'Secure your digital life. Master cybersecurity, privacy tools, and the technologies that shape our future.' },
          ].map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card hoverable>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.desc}</FeatureDescription>
              </Card>
            </motion.div>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductsSection>
          <ProductsInner>
            <AnimatedSection>
              <SectionTitle>The Arsenal</SectionTitle>
              <SectionSubtitle>
                Premium courses and ebooks built to give you an unfair advantage.
              </SectionSubtitle>
            </AnimatedSection>
            <ProductsGrid
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Card hoverable>
                    <Link to={`/store/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <ProductImagePlaceholder $type={product.type}>
                        {product.type === 'course' ? '🎓' : '📘'}
                      </ProductImagePlaceholder>
                      <ProductTitle>{product.title}</ProductTitle>
                      <ProductDesc>{product.shortDescription}</ProductDesc>
                    </Link>
                    <ProductPriceRow>
                      <ProductPrice>
                        {product.salePrice
                          ? formatPrice(product.salePrice)
                          : formatPrice(product.price)}
                      </ProductPrice>
                      <Button size="sm" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </Button>
                    </ProductPriceRow>
                  </Card>
                </motion.div>
              ))}
            </ProductsGrid>
            <ViewAllLink>
              <Link to="/store">
                <Button variant="outline">View All Products</Button>
              </Link>
            </ViewAllLink>
          </ProductsInner>
        </ProductsSection>
      )}

      {/* Latest Articles */}
      <ArticlesSection>
        <AnimatedSection>
          <SectionTitle>Latest From The Blog</SectionTitle>
          <SectionSubtitle>
            Deep dives into the topics that matter. No fluff, no gatekeeping.
          </SectionSubtitle>
        </AnimatedSection>
        <ArticlesGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {latestArticles.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
                <Card hoverable>
                  <ArticleImage>
                    <img src={article.featuredImage} alt={article.title} />
                  </ArticleImage>
                  <ArticleCategoryBadge>{article.category}</ArticleCategoryBadge>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                  <ArticleMeta>
                    <span>{article.author.name}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </ArticleMeta>
                </Card>
              </Link>
            </motion.div>
          ))}
        </ArticlesGrid>
        <ViewAllLink>
          <Link to="/blog">
            <Button variant="outline">Read More Articles</Button>
          </Link>
        </ViewAllLink>
      </ArticlesSection>

      {/* Testimonials */}
      <TestimonialsSection>
        <TestimonialsInner>
          <AnimatedSection>
            <SectionTitle>From The Community</SectionTitle>
            <SectionSubtitle>
              Real results from people who stopped waiting for permission.
            </SectionSubtitle>
          </AnimatedSection>
          <TestimonialsGrid
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.author} variants={itemVariants}>
                <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
                <TestimonialFooter>
                  <TestimonialAvatar>{testimonial.initials}</TestimonialAvatar>
                  <TestimonialAuthorInfo>
                    <TestimonialAuthorName>{testimonial.author}</TestimonialAuthorName>
                    <TestimonialAuthorRole>{testimonial.role}</TestimonialAuthorRole>
                  </TestimonialAuthorInfo>
                  <TestimonialStars>{starString(testimonial.rating)}</TestimonialStars>
                </TestimonialFooter>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </TestimonialsInner>
      </TestimonialsSection>

      {/* CTA */}
      <CTASection>
        <AnimatedSection>
          <SectionTitle>Ready to Wake Up?</SectionTitle>
          <CTAText>
            Join thousands who have already taken the red pill. Get access to
            exclusive content, courses, and a community of like-minded individuals.
          </CTAText>
          <Link to="/register">
            <Button variant="accent" size="lg">
              Enter The Construct
            </Button>
          </Link>
        </AnimatedSection>
      </CTASection>
    </>
  );
};

export default Home;
