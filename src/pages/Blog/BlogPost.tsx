import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import { media } from '../../styles/breakpoints';
import { articles } from '../../data/articles';

const BlogPostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  ${media.tablet} {
    padding: 4rem 2rem;
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

const ArticleHeader = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const Category = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 255, 65, 0.1);
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  line-height: 1.2;

  ${media.tablet} {
    font-size: 3rem;
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 3rem;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.125rem;
  line-height: 1.8;

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 2.5rem 0 1rem;
    line-height: 1.3;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; padding-bottom: 0.5rem; }
  h3 { font-size: 1.5rem; }
  
  p {
    margin-bottom: 1.5rem;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.25rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color ${({ theme }) => theme.transitions.fast};

    &:hover {
      border-bottom-color: ${({ theme }) => theme.colors.primary};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  hr {
    border: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    margin: 3rem 0;
  }
`;

const TagsContainer = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surfaceLight};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Simple markdown parser for headings, lists, blockquotes, and paragraphs
  const lines = content.split('\n');
  const elements: React.JSX.Element[] = [];
  
  let listItems: React.JSX.Element[] = [];
  let inList = false;

  lines.forEach((line, index) => {
    // Handle headings
    if (line.startsWith('# ')) {
      if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      // Skip H1 since we render title separately
      return;
    }
    
    if (line.startsWith('## ')) {
      if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h2 key={index}>{line.replace('## ', '')}</h2>);
      return;
    }
    
    if (line.startsWith('### ')) {
      if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h3 key={index}>{line.replace('### ', '')}</h3>);
      return;
    }

    // Handle blockquotes
    if (line.startsWith('> ')) {
      if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<blockquote key={index}>{line.replace('> ', '')}</blockquote>);
      return;
    }
    
    // Handle horizontal rule
    if (line.startsWith('---')) {
       if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<hr key={index} />);
      return;
    }

    // Handle lists
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      inList = true;
      const text = line.trim().substring(2);
      // Handle bold text in list items
      const parts = text.split(/(\*\*.*?\*\*)/g);
      const formattedText = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      listItems.push(<li key={index}>{formattedText}</li>);
      return;
    }
    
    // Close list if we hit a non-list line
    if (inList && line.trim() === '') {
      elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
      listItems = [];
      inList = false;
      return;
    }

    // Handle paragraphs
    if (line.trim() !== '') {
      if (inList) {
        // If we are still in a list but hit text, maybe it's part of the list item or a new paragraph?
        // Let's close the list to be safe.
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      
      // Handle bold text
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      const formattedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
         if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
      
      elements.push(<p key={index}>{formattedLine}</p>);
    }
  });
  
  // Flush remaining list items
  if (inList) {
    elements.push(<ul key="ul-end">{listItems}</ul>);
  }

  return <>{elements}</>;
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    if (!article) {
      // Redirect to blog index if not found (or show 404)
      // For now, let's just stay here and show not found message
    }
  }, [article, navigate]);

  if (!article) {
    return (
      <>
        <SEOHead title="Article Not Found" description="The requested article could not be found." noindex />
        <BlogPostContainer>
          <Title>Article not found</Title>
          <Button variant="primary" onClick={() => navigate('/blog')}>Back to Blog</Button>
        </BlogPostContainer>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title={article.title} 
        description={article.excerpt}
        image={article.featuredImage}
        path={`/blog/${article.slug}`}
        type="article"
        keywords={article.tags}
        publishedTime={article.publishedAt.toISOString()}
        modifiedTime={article.updatedAt.toISOString()}
      />
      
      <BlogPostContainer>
        <BackLink to="/blog">← Back to Blog</BackLink>
        
        <ArticleHeader>
          <Category>{article.category}</Category>
          <Title>{article.title}</Title>
          <Meta>
            <Author>
              <img src={article.author.avatar} alt={article.author.name} />
              <span>{article.author.name}</span>
            </Author>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </Meta>
          {article.featuredImage && (
            <FeaturedImage src={article.featuredImage} alt={article.title} />
          )}
        </ArticleHeader>
        
        <Content>
          <MarkdownRenderer content={article.content} />
        </Content>
        
        <TagsContainer>
          {article.tags.map(tag => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </TagsContainer>
      </BlogPostContainer>
    </>
  );
};

export default BlogPost;
