import { sanitizeInput } from './validation';

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https:'],
  'connect-src': ["'self'", 'https://api.openai.com', 'https://firestore.googleapis.com'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// XSS Protection
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '');
};

// CSRF Protection
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Input validation and sanitization
export const validateAndSanitizeInput = (input, type = 'text') => {
  if (!input) return '';
  
  const sanitized = sanitizeInput(input);
  
  switch (type) {
    case 'email':
      return sanitized.toLowerCase();
    case 'url':
      try {
        new URL(sanitized);
        return sanitized;
      } catch {
        return '';
      }
    case 'html':
      return sanitizeHtml(sanitized);
    default:
      return sanitized;
  }
};

// Rate limiting for client-side
export const createClientRateLimiter = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Check if limit exceeded
    if (requests.size >= maxRequests) {
      return false;
    }
    
    // Add new request
    requests.set(identifier, now);
    return true;
  };
};

// Secure storage utilities
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  }
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    isStrong: score >= 4,
    checks
  };
};

// Session management
export const sessionManager = {
  createSession: (userData) => {
    const session = {
      id: generateCSRFToken(),
      user: userData,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    secureStorage.setItem('session', session);
    return session;
  },
  
  getSession: () => {
    const session = secureStorage.getItem('session');
    if (!session) return null;
    
    if (Date.now() > session.expiresAt) {
      secureStorage.removeItem('session');
      return null;
    }
    
    return session;
  },
  
  clearSession: () => {
    secureStorage.removeItem('session');
  }
}; 