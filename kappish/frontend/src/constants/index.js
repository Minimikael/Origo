// Document status constants
export const DOCUMENT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
};

// AI analysis types
export const AI_ANALYSIS_TYPES = {
  WRITING_SUGGESTIONS: 'writing_suggestions',
  CONTENT_ANALYSIS: 'content_analysis',
  PLAGIARISM_CHECK: 'plagiarism_check',
  GEMINI_GENERATION: 'gemini_generation'
};

// Citation styles
export const CITATION_STYLES = {
  APA: 'APA',
  MLA: 'MLA',
  CHICAGO: 'Chicago',
  HARVARD: 'Harvard',
  VANCOUVER: 'Vancouver'
};

// Source types
export const SOURCE_TYPES = {
  WEBSITE: 'website',
  BOOK: 'book',
  ARTICLE: 'article',
  VIDEO: 'video',
  OTHER: 'other'
};

// Research status
export const RESEARCH_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// UI constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  MAX_TITLE_LENGTH: 100,
  MIN_CONTENT_LENGTH: 50,
  MAX_CONTENT_PREVIEW: 2000
};

// API constants
export const API_CONSTANTS = {
  DEFAULT_MAX_TOKENS: 1000,
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MODEL: 'gemini-1.5-flash'
}; 