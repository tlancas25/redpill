import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { GitHubAuthProvider } from './context/GitHubAuthContext';
import GlobalStyles from './styles/GlobalStyles';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/shared/ErrorBoundary';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Loader from './components/ui/Loader';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Store = lazy(() => import('./pages/Store'));
const ProductDetail = lazy(() => import('./pages/Store').then(module => ({ default: module.ProductDetail })));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/Blog').then(module => ({ default: module.BlogPost })));
const Learning = lazy(() => import('./pages/Learning'));
const CourseDetail = lazy(() => import('./pages/Learning').then(module => ({ default: module.CourseDetail })));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth pages
const LoginPage = lazy(() =>
  import('./pages/Auth').then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./pages/Auth').then((module) => ({ default: module.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('./pages/Auth').then((module) => ({ default: module.ForgotPasswordPage }))
);

// Checkout pages
const CartPage = lazy(() =>
  import('./pages/Checkout').then((module) => ({ default: module.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/Checkout').then((module) => ({ default: module.CheckoutPage }))
);

// Legal pages
const PrivacyPolicyPage = lazy(() =>
  import('./pages/Legal').then((module) => ({ default: module.PrivacyPolicyPage }))
);
const TermsOfServicePage = lazy(() =>
  import('./pages/Legal').then((module) => ({ default: module.TermsOfServicePage }))
);
const RefundPolicyPage = lazy(() =>
  import('./pages/Legal').then((module) => ({ default: module.RefundPolicyPage }))
);
const CookiePolicyPage = lazy(() =>
  import('./pages/Legal').then((module) => ({ default: module.CookiePolicyPage }))
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <GlobalStyles />
        <ErrorBoundary>
          <GitHubAuthProvider>
            <AuthProvider>
              <CartProvider>
                <Router>
                <MainLayout>
                  <Suspense fallback={<Loader fullPage text="Loading..." />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/store/:slug" element={<ProductDetail />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/learn" element={<Learning />} />
                      <Route path="/learn/course/:slug" element={<CourseDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<CartPage />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* Protected Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Legal Routes */}
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                      <Route path="/refund-policy" element={<RefundPolicyPage />} />
                      <Route path="/cookie-policy" element={<CookiePolicyPage />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </MainLayout>
              </Router>
              </CartProvider>
            </AuthProvider>
          </GitHubAuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
