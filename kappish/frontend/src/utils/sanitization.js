/**
 * Sanitizes user input to prevent XSS and injection attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other potentially dangerous HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove common injection patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};

/**
 * Sanitizes content for AI prompts
 * @param {string} content - The content to sanitize
 * @param {number} maxLength - Maximum length allowed
 * @returns {string} - The sanitized content
 */
export const sanitizeForAIPrompt = (content, maxLength = 2000) => {
  const sanitized = sanitizeInput(content);
  
  // Limit length for AI prompts
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength) + '...';
  }
  
  return sanitized;
};

/**
 * Validates document title
 * @param {string} title - The title to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validateDocumentTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, message: 'Title is required' };
  }
  
  const sanitized = sanitizeInput(title);
  
  if (sanitized.length === 0) {
    return { isValid: false, message: 'Title cannot be empty' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, message: 'Title must be 100 characters or less' };
  }
  
  return { isValid: true, message: '', sanitizedTitle: sanitized };
}; 