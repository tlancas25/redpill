// ==================== User Types ====================
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  purchasedProducts: string[];
  courseProgress: Record<string, CourseProgress>;
  savedArticles: string[];
  subscription: {
    plan: 'free' | 'premium';
    validUntil: Date | null;
  };
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  lastWatched: string;
  progressPercentage: number;
}

// ==================== Product Types ====================
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  stripePriceId?: string;
  price: number;
  salePrice: number | null;
  category: string;
  type: 'ebook' | 'course';
  images: string[];
  curriculum: CurriculumSection[];
  downloadUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  featured: boolean;
}

export interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  resources: string[];
}

// ==================== Cart Types ====================
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// ==================== Blog Types ====================
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  featured: boolean;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

// ==================== Course Types ====================
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewVideo: string;
  instructor: Author;
  price: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: number;
  sections: CurriculumSection[];
  enrolledCount: number;
  rating: number;
}

// ==================== Order Types ====================
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId: string;
  createdAt: Date;
}

// ==================== Review Types ====================
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ==================== Comment Types ====================
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  articleId: string;
  content: string;
  createdAt: Date;
}

// ==================== Contact Form Types ====================
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ==================== FAQ Types ====================
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
