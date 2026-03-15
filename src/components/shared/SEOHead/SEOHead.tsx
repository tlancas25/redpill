import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, APP_TAGLINE, SITE_URL } from '../../../utils/constants';

interface SEOHeadProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: string;
  noindex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const NOINDEX_PATHS = [/^\/login$/, /^\/register$/, /^\/forgot-password$/, /^\/dashboard$/, /^\/cart$/, /^\/checkout$/];

const toAbsoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${SITE_URL}${normalizedPath}`;
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = APP_TAGLINE,
  image = '/logo512.png',
  path,
  type = 'website',
  noindex,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  section,
}) => {
  const currentPath = typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search}`
    : '/';
  const resolvedPath = path || currentPath;
  const canonicalUrl = toAbsoluteUrl(resolvedPath);
  const imageUrl = toAbsoluteUrl(image);
  const fullTitle = `${title} | ${APP_NAME}`;
  const shouldNoIndex = noindex ?? NOINDEX_PATHS.some((pattern) => pattern.test(resolvedPath));

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {shouldNoIndex && <meta name="robots" content="noindex, nofollow" />}
      {shouldNoIndex && <meta name="googlebot" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={APP_NAME} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@redpillreader" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional Meta */}
      <meta property="og:locale" content="en_US" />
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEOHead;
