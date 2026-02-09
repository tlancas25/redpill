# RedPillReader.com

> **Decode the System. Master the Machine. Own Your Future.**

Full-stack e-commerce store + blog + video learning platform built with React, TypeScript, Node.js, Firebase, and Stripe.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (TypeScript) + styled-components + Framer Motion |
| Routing | React Router DOM v7 (Lazy-loaded) |
| Backend | Node.js / Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Email/Password + Google) |
| Payments | Stripe |
| Video | React Player |
| SEO | React Helmet Async |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with Firestore + Auth + Storage enabled
- Stripe account (test keys)

### Installation

```bash
# Clone the repo
git clone <repo-url> redpill
cd redpill

# Install frontend dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env
# Fill in your Firebase + Stripe keys in .env

# Start the frontend
npm start

# In a separate terminal, start the backend
cd server
node index.js
```

> **Note:** The `--legacy-peer-deps` flag is required due to React 19 peer dependency conflicts with some packages.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `REACT_APP_API_URL` | Backend API URL (default: http://localhost:5000/api) |

## Project Structure

```
redpill/
├── public/                  # Static assets
├── server/                  # Express backend
│   ├── routes/              # API route handlers
│   ├── middleware/           # Auth middleware
│   └── index.js             # Server entry point
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Modal, Navbar, Footer, Input, Loader
│   │   ├── layout/          # MainLayout, Sidebar, Header
│   │   └── shared/          # SEOHead, ProtectedRoute, ErrorBoundary
│   ├── context/             # AuthContext, CartContext, ThemeContext
│   ├── hooks/               # useAuth, useCart, useCourseProgress, useResponsive
│   ├── pages/               # All page components
│   ├── services/            # Firebase, Auth, Stripe, API services
│   ├── styles/              # Theme, GlobalStyles, Breakpoints
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Constants, Helpers, Validators
│   ├── App.tsx              # Root component with routing
│   └── index.tsx            # Entry point
├── .env.example             # Environment variable template
├── package.json
└── tsconfig.json
```

## Routes

| Path | Page | Auth Required |
|------|------|:------------:|
| `/` | Home | No |
| `/store` | Store | No |
| `/blog` | Blog | No |
| `/learning` | Learning Hub | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/forgot-password` | Forgot Password | No |
| `/about` | About | No |
| `/contact` | Contact | No |
| `/cart` | Shopping Cart | No |
| `/dashboard` | User Dashboard | Yes |
| `/checkout` | Checkout | Yes |
| `/privacy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `/refund-policy` | Refund Policy | No |
| `/cookie-policy` | Cookie Policy | No |

## Design System

- **Theme:** Matrix-inspired dark theme
- **Primary Color:** `#00ff41` (Matrix green)
- **Accent Color:** `#ff3333` (Red pill red)
- **Background:** `#0d0d0d`
- **Heading Font:** Orbitron / Share Tech Mono
- **Body Font:** Roboto / Inter
- **Code Font:** Fira Code

---

## License

All rights reserved © 2026 RedPillReader
