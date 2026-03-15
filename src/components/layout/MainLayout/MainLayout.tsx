import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from '../../ui/Navbar';
import Footer from '../../ui/Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 70px; /* Account for fixed navbar */
`;

const PageTransition = styled(motion.div)`
  min-height: calc(100vh - 70px);
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutWrapper>
      <Navbar />
      <MainContent>
        <PageTransition
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </PageTransition>
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;
