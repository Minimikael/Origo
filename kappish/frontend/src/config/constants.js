// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// AI Models
export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  CLAUDE_3: 'claude-3',
  CLAUDE_2: 'claude-2'
};

// UI Constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 64,
  COLLAPSED_SIDEBAR_WIDTH: 16,
  ANIMATION_DURATION: 300,
  TRANSITION_EASING: 'ease-in-out'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  DOCUMENT_TITLE_MIN_LENGTH: 1,
  DOCUMENT_TITLE_MAX_LENGTH: 100,
  DOCUMENT_CONTENT_MAX_LENGTH: 100000
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_TOO_LONG: 'Password must be less than 128 characters',
  INVALID_URL: 'Please enter a valid URL',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_SAVED: 'Document saved successfully',
  DOCUMENT_CREATED: 'Document created successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully'
};

// Plagiarism Thresholds
export const PLAGIARISM_THRESHOLDS = {
  LOW: 0.1,
  MEDIUM: 0.3,
  HIGH: 0.5,
  CRITICAL: 0.7
};

// Reliability Colors
export const RELIABILITY_COLORS = {
  HIGH: '#10B981',    // Green
  MEDIUM: '#F59E0B',  // Yellow
  LOW: '#EF4444'       // Red
};

// Document Types
export const DOCUMENT_TYPES = {
  ARTICLE: 'article',
  REPORT: 'report',
  ESSAY: 'essay',
  RESEARCH: 'research',
  CREATIVE: 'creative'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Feature Flags
export const FEATURE_FLAGS = {
  AI_ASSISTANCE: true,
  REAL_TIME_COLLABORATION: true,
  EXPORT_FEATURES: true,
  ADVANCED_ANALYTICS: false
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'origo_auth_token',
  USER_PREFERENCES: 'origo_user_preferences',
  THEME: 'origo_theme',
  SIDEBAR_STATE: 'origo_sidebar_state'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// Rate Limiting
export const RATE_LIMITS = {
  API_CALLS_PER_MINUTE: 60,
  AUTH_ATTEMPTS_PER_HOUR: 5,
  DOCUMENT_SAVES_PER_MINUTE: 10
};

// Export this as default for backward compatibility
export default {
  API_CONFIG,
  FIREBASE_CONFIG,
  AI_MODELS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLAGIARISM_THRESHOLDS,
  RELIABILITY_COLORS,
  DOCUMENT_TYPES,
  USER_ROLES,
  FEATURE_FLAGS,
  STORAGE_KEYS,
  PAGINATION,
  RATE_LIMITS
}; 