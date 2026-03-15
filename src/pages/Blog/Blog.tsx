import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEOHead from '../../components/shared/SEOHead';
import StructuredData from '../../components/shared/StructuredData';
import { buildItemListSchema, buildOrganizationSchema } from '../../utils/structuredData';
import { SITE_URL } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { media } from '../../styles/breakpoints';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { debounce } from '../../utils/helpers';
import { articles } from '../../data/articles';

// ==================== Blog Hero ====================
const BlogHero = styled.section`
  text-align: center;
  padding: 3rem 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 4rem 2rem 2.5rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 0.75rem;
  text-shadow: ${({ theme }) => theme.shadows.glow};

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto;
`;

// ==================== Container ====================
const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;

  ${media.tablet} {
    padding: 0 2rem 4rem;
  }
`;

// ==================== Search ====================
const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto 2rem;
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px rgba(0, 255, 65, 0.2);
  }
`;

// ==================== Category Tabs ====================
const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.background : theme.colors.textSecondary};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.background : theme.colors.primary};
  }
`;

// ==================== Featured Article ====================
const FeaturedArticleCard = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: 3rem;
  transition: border-color ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${media.tablet} {
    grid-template-columns: 1.2fr 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  ${FeaturedArticleCard}:hover & img {
    transform: scale(1.03);
  }

  ${media.tablet} {
    height: 100%;
    min-height: 320px;
  }
`;

const FeaturedContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeaturedBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.accent};
  background: rgba(255, 51, 51, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: inline-block;
  margin-bottom: 1rem;
  width: fit-content;
`;

const FeaturedTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;

  ${media.tablet} {
    font-size: 1.75rem;
  }
`;

const FeaturedExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ==================== Article Grid ====================
const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// ==================== Article Card ====================
const ArticleImageContainer = styled.div`
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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 255, 65, 0.08), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const StyledCard = styled(Card)`
  &:hover ${ArticleImageContainer} img {
    transform: scale(1.05);
  }

  &:hover ${ArticleImageContainer}::after {
    opacity: 1;
  }
`;

const CategoryBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TagChip = styled.span`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.15rem 0.4rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  letter-spacing: 0.3px;
`;

const ArticleTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin: 0.75rem 0 0.5rem;
`;

const ArticleExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
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
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

// ==================== Newsletter CTA ====================
const NewsletterBanner = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2.5rem 2rem;
  text-align: center;
  margin: 2.5rem 0;
`;

const NewsletterTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const NewsletterSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 450px;
  margin: 0 auto;

  ${media.tablet} {
    flex-direction: row;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.85rem;
  letter-spacing: 0.5px;
`;

// ==================== Animation Variants ====================
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: Math.min(i * 0.08, 0.6) },
  }),
};

// ==================== Blog Component ====================
const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Find featured article
  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  // Filter articles (excluding featured from the grid)
  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => a.id !== featuredArticle.id);

    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery, featuredArticle.id]);

  // Split articles for newsletter insertion
  const firstBatch = filteredArticles.slice(0, 3);
  const secondBatch = filteredArticles.slice(3);
  const showNewsletter = filteredArticles.length > 2;

  return (
    <>
      <SEOHead
        title="Blog"
        description="Read RedPillReader articles on health, wealth, mindset, privacy, survival, and technology for modern sovereign living."
        path="/blog"
        keywords={['blog', 'health articles', 'wealth articles', 'privacy tools', 'survival skills']}
      />
      <StructuredData data={[
        buildItemListSchema('RedPillReader Blog Articles', articles.map(a => ({ name: a.title, url: `${SITE_URL}/blog/${a.slug}` }))),
        buildOrganizationSchema(),
      ]} />

      <BlogHero>
        <PageTitle>The Blog</PageTitle>
        <HeroSubtitle>
          Deep dives into the topics that matter. No fluff, no gatekeeping, no permission needed.
        </HeroSubtitle>
      </BlogHero>

      <BlogContainer>
        {/* Search */}
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search articles..."
            value={searchInput}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        {/* Category Tabs */}
        <CategoryTabs>
          {BLOG_CATEGORIES.map((cat) => (
            <Tab
              key={cat}
              $active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Tab>
          ))}
        </CategoryTabs>

        {/* Featured Article */}
        {!searchQuery && activeCategory === 'All' && (
          <StyledLink to={`/blog/${featuredArticle.slug}`}>
            <FeaturedArticleCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedImage>
                <img src={featuredArticle.featuredImage} alt={featuredArticle.title} />
              </FeaturedImage>
              <FeaturedContent>
                <FeaturedBadge>Featured</FeaturedBadge>
                <FeaturedTitle>{featuredArticle.title}</FeaturedTitle>
                <FeaturedExcerpt>{featuredArticle.excerpt}</FeaturedExcerpt>
                <FeaturedMeta>
                  <span>{featuredArticle.author.name}</span>
                  <span>·</span>
                  <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{featuredArticle.readTime} min read</span>
                </FeaturedMeta>
              </FeaturedContent>
            </FeaturedArticleCard>
          </StyledLink>
        )}

        {/* First batch of articles */}
        <ArticleGrid>
          {firstBatch.map((article, index) => (
            <motion.div
              key={article.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              <StyledLink to={`/blog/${article.slug}`}>
                <StyledCard hoverable>
                  <ArticleImageContainer>
                    <img src={article.featuredImage} alt={article.title} />
                  </ArticleImageContainer>
                  <CategoryBadge>{article.category}</CategoryBadge>
                  <TagsRow>
                    {article.tags.slice(0, 3).map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </TagsRow>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                  <ArticleMeta>
                    <span>{article.author.name}</span>
                    <span>·</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </ArticleMeta>
                </StyledCard>
              </StyledLink>
            </motion.div>
          ))}
        </ArticleGrid>

        {/* Newsletter CTA */}
        {showNewsletter && (
          <NewsletterBanner
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <NewsletterTitle>Get Weekly Red Pills</NewsletterTitle>
            <NewsletterSubtitle>
              Actionable insights on health, wealth, and sovereignty delivered straight to your inbox. No spam, no fluff.
            </NewsletterSubtitle>
            {subscribed ? (
              <SuccessMessage>You're in. Welcome to the construct.</SuccessMessage>
            ) : (
              <NewsletterForm onSubmit={handleSubscribe}>
                <NewsletterInput
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </NewsletterForm>
            )}
          </NewsletterBanner>
        )}

        {/* Second batch of articles */}
        {secondBatch.length > 0 && (
          <ArticleGrid>
            {secondBatch.map((article, index) => (
              <motion.div
                key={article.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
              >
                <StyledLink to={`/blog/${article.slug}`}>
                  <StyledCard hoverable>
                    <ArticleImageContainer>
                      <img src={article.featuredImage} alt={article.title} />
                    </ArticleImageContainer>
                    <CategoryBadge>{article.category}</CategoryBadge>
                    <TagsRow>
                      {article.tags.slice(0, 3).map((tag) => (
                        <TagChip key={tag}>{tag}</TagChip>
                      ))}
                    </TagsRow>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                    <ArticleMeta>
                      <span>{article.author.name}</span>
                      <span>·</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{article.readTime} min read</span>
                    </ArticleMeta>
                  </StyledCard>
                </StyledLink>
              </motion.div>
            ))}
          </ArticleGrid>
        )}

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem 1rem', color: '#b3b3b3' }}
          >
            {searchQuery
              ? `No articles found for "${searchQuery}".`
              : 'No articles found in this category.'}
          </motion.div>
        )}
      </BlogContainer>
    </>
  );
};

export default Blog;
