import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Product } from '../../types';
import { productsAPI } from '../../services/api';

const ProductCardWrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ProductImage = styled.div<{ $type: string }>`
  width: 100%;
  height: 160px;
  background: ${({ theme, $type }) =>
    $type === 'bundle'
      ? theme.colors.surfaceHover
      : $type === 'course'
      ? theme.colors.surfaceLight
      : theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const TypeBadge = styled.span`
  position: absolute;
  top: 1.5rem;
  left: 1rem;
  background: ${({ theme }) => theme.colors.background}E6;
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Desc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
  text-align: center;
  margin-top: 0.5rem;
`;

interface PurchasedProductCardProps {
  product: Product;
  userId: string;
}

const PurchasedProductCard: React.FC<PurchasedProductCardProps> = ({ product, userId }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');
      
      // Get the signed download URL via backend
      // We pass a dummy orderId 'dashboard' for now or handle accordingly on the backend
      const response = await productsAPI.getDownload(product.id, userId, 'dashboard_request');
      
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      } else {
         setError('Download link not found');
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.response?.data?.error || 'Failed to initialize download');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProductCardWrapper>
        <ProductImage $type={product.type}>
          {product.type === 'bundle' ? '📦' : product.type === 'course' ? '🎓' : '📘'}
        </ProductImage>
        <TypeBadge>
          {product.type === 'bundle' ? 'BUNDLE' : product.type === 'course' ? 'COURSE' : 'EBOOK'}
        </TypeBadge>
        
        <Title>{product.title}</Title>
        <Desc>{product.shortDescription}</Desc>

        <ActionRow>
            {(product.type === 'course' || product.type === 'bundle') && (
              <Link to={`/learn/${product.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
                <Button fullWidth variant="primary">
                  {product.type === 'bundle' ? 'Access Content' : 'Continue Course'}
                </Button>
              </Link>
            )}

            {(product.type === 'ebook' || product.type === 'bundle' || product.downloadUrl) && (
              <Button 
                fullWidth 
                variant="outline" 
                onClick={handleDownload}
                disabled={downloading}
                style={{ width: '100%' }}
              >
                {downloading ? 'Preparing Download...' : 'Download Files'}
              </Button>
            )}

            {error && <ErrorMsg>{error}</ErrorMsg>}
        </ActionRow>

      </ProductCardWrapper>
    </Card>
  );
};

export default PurchasedProductCard;
