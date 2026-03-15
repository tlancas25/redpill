import { SITE_URL, APP_NAME, APP_TAGLINE, SOCIAL_LINKS, SUPPORT_EMAIL } from './constants';

const LOGO_URL = `${SITE_URL}/logo512.png`;

/* ── Organization (every page) ── */
export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: APP_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
  description: APP_TAGLINE,
  sameAs: [SOCIAL_LINKS.twitter, SOCIAL_LINKS.youtube, SOCIAL_LINKS.discord],
  contactPoint: {
    '@type': 'ContactPoint',
    email: SUPPORT_EMAIL,
    contactType: 'customer service',
  },
});

/* ── WebSite (Home page only) ── */
export const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: APP_NAME,
  url: SITE_URL,
  description: APP_TAGLINE,
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/* ── FAQPage (AI Info + Contact pages) ── */
export const buildFAQPageSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/* ── Course (CourseDetail page) ── */
export const buildCourseSchema = (course: {
  title: string;
  description: string;
  slug: string;
  price: number;
  difficulty: string;
  lessonCount: number;
  totalDuration: number;
  rating: number;
  enrolledCount: number;
  instructor: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  url: `${SITE_URL}/learn/course/${course.slug}`,
  provider: {
    '@type': 'Organization',
    name: APP_NAME,
    url: SITE_URL,
  },
  instructor: {
    '@type': 'Person',
    name: course.instructor,
  },
  offers: {
    '@type': 'Offer',
    price: course.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/learn/course/${course.slug}`,
  },
  educationalLevel: course.difficulty,
  numberOfLessons: course.lessonCount,
  timeRequired: `PT${course.totalDuration}M`,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: course.rating,
    bestRating: 5,
    ratingCount: course.enrolledCount,
  },
});

/* ── Article (BlogPost page) ── */
export const buildArticleSchema = (article: {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  author: { name: string };
  publishedAt: Date;
  updatedAt: Date;
  content: string;
  tags: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.featuredImage,
  url: `${SITE_URL}/blog/${article.slug}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/blog/${article.slug}`,
  },
  author: {
    '@type': 'Person',
    name: article.author.name,
  },
  publisher: {
    '@type': 'Organization',
    name: APP_NAME,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
    },
  },
  datePublished: article.publishedAt.toISOString(),
  dateModified: article.updatedAt.toISOString(),
  wordCount: article.content.split(/\s+/).length,
  keywords: article.tags.join(', '),
});

/* ── Product (ProductDetail page) ── */
export const buildProductSchema = (product: {
  title: string;
  description: string;
  slug: string;
  images: string[];
  price: number;
  salePrice?: number | null;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  url: `${SITE_URL}/store/${product.slug}`,
  image: product.images?.[0] || LOGO_URL,
  category: product.category,
  brand: {
    '@type': 'Organization',
    name: APP_NAME,
  },
  offers: {
    '@type': 'Offer',
    price: product.salePrice ?? product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/store/${product.slug}`,
  },
});

/* ── BreadcrumbList (all inner pages) ── */
export const buildBreadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/* ── ItemList (Store, Blog, Learning listing pages) ── */
export const buildItemListSchema = (
  name: string,
  items: { name: string; url: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    url: item.url,
  })),
});
