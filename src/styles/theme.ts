export const darkTheme = {
  colors: {
    primary: '#00ff41',
    secondary: '#008f11',
    background: '#0d0d0d',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    accent: '#ff3333',
    warning: '#ffcc00',
    error: '#ff4444',
    success: '#00ff41',
    border: '#333333',
  },
  fonts: {
    heading: "'Orbitron', 'Share Tech Mono', sans-serif",
    body: "'Roboto', 'Inter', sans-serif",
    code: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 255, 65, 0.05)',
    md: '0 4px 6px rgba(0, 255, 65, 0.1)',
    lg: '0 10px 15px rgba(0, 255, 65, 0.1)',
    glow: '0 0 15px rgba(0, 255, 65, 0.3)',
    glowStrong: '0 0 30px rgba(0, 255, 65, 0.5)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  zIndex: {
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
  },
};

export const lightTheme: Theme = {
  colors: {
    primary: '#00aa2e',
    secondary: '#008822',
    background: '#f5f5f0',
    surface: '#ffffff',
    surfaceLight: '#eaeae5',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    accent: '#cc2929',
    warning: '#cc9900',
    error: '#cc3333',
    success: '#00aa2e',
    border: '#d4d4d4',
  },
  fonts: darkTheme.fonts,
  fontSizes: darkTheme.fontSizes,
  spacing: darkTheme.spacing,
  borderRadius: darkTheme.borderRadius,
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    glow: '0 0 10px rgba(0, 170, 46, 0.15)',
    glowStrong: '0 0 20px rgba(0, 170, 46, 0.2)',
  },
  transitions: darkTheme.transitions,
  zIndex: darkTheme.zIndex,
};

// Backward compatibility
export const theme = darkTheme;

export type Theme = typeof darkTheme;
