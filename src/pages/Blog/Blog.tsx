import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import { media } from '../../styles/breakpoints';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { Article } from '../../types';

const BlogContainer = styled.div`
  max-width: 1200px;
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
  margin-bottom: 2rem;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

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
  }
`;

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

const ArticleImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
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
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

// Sample articles
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'Top 10 Biohacks for Cognitive Performance',
    slug: 'top-10-biohacks-cognitive',
    excerpt: 'Unlock your brain\'s potential with these proven biohacking strategies for focus, memory, and mental clarity.',
    content: '',
    featuredImage: '',
    category: 'Health',
    tags: ['biohacking', 'health', 'focus'],
    author: { name: 'RedPill Team', avatar: '', bio: '' },
    publishedAt: new Date(),
    updatedAt: new Date(),
    readTime: 8,
    featured: true,
  },
  {
    id: '2',
    title: 'The Psychology of the Matrix',
    slug: 'psychology-of-matrix',
    excerpt: 'Understanding the psychological mechanisms used to keep the masses asleep, and how to break free.',
    content: '',
    featuredImage: '',
    category: 'Mindset',
    tags: ['psychology', 'matrix', 'freedom'],
    author: { name: 'RedPill Team', avatar: '', bio: '' },
    publishedAt: new Date(),
    updatedAt: new Date(),
    readTime: 12,
    featured: true,
  },
  {
    id: '3',
    title: 'Building Generational Wealth in 2026',
    slug: 'generational-wealth-2026',
    excerpt: 'Strategies for creating sovereign wealth that can withstand economic turbulence and system shocks.',
    content: '',
    featuredImage: '',
    category: 'Wealth',
    tags: ['wealth', 'finance', 'sovereignty'],
    author: { name: 'RedPill Team', avatar: '', bio: '' },
    publishedAt: new Date(),
    updatedAt: new Date(),
    readTime: 15,
    featured: true,
  },
  {
    id: '4',
    title: '5 Essential Privacy Tools Everyone Needs',
    slug: '5-essential-privacy-tools',
    excerpt: 'Protect your digital footprint with these must-have privacy tools that every internet user should know about.',
    content: '',
    featuredImage: '',
    category: 'Tech',
    tags: ['privacy', 'tools', 'security'],
    author: { name: 'RedPill Team', avatar: '', bio: '' },
    publishedAt: new Date(),
    updatedAt: new Date(),
    readTime: 5,
    featured: false,
  },
  {
    id: '5',
    title: 'Urban Survival: Bug In or Bug Out?',
    slug: 'urban-survival-bug-in-out',
    excerpt: 'Analyzing the pros and cons of sheltering in place vs. evacuating during a major crisis.',
    content: '',
    featuredImage: '',
    category: 'Survival',
    tags: ['survival', 'prep', 'crisis'],
    author: { name: 'RedPill Team', avatar: '', bio: '' },
    publishedAt: new Date(),
    updatedAt: new Date(),
    readTime: 10,
    featured: false,
  },
];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredArticles =
    activeCategory === 'All'
      ? sampleArticles
      : sampleArticles.filter((a) => a.category === activeCategory);

  return (
    <>
      <SEOHead title="Blog" description="Insights, guides, and news on health, wealth, mindset, and survival for the modern sovereign individual." />

      <BlogContainer>
        <PageTitle>The Blog</PageTitle>

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

        <ArticleGrid>
          {filteredArticles.map((article) => (
            <StyledLink key={article.id} to={`/blog/${article.slug}`}>
              <Card hoverable>
                <ArticleImage>📝</ArticleImage>
                <CategoryBadge>{article.category}</CategoryBadge>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                <ArticleMeta>
                  <span>{article.author.name}</span>
                  <span>·</span>
                  <span>{article.readTime} min read</span>
                </ArticleMeta>
              </Card>
            </StyledLink>
          ))}
        </ArticleGrid>
      </BlogContainer>
    </>
  );
};

export default Blog;
