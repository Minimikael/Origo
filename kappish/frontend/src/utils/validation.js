import { VALIDATION_RULES } from '../config/constants';

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  return { isValid: true, message: '' };
};

// Document title validation
export const validateDocumentTitle = (title) => {
  if (!title) return { isValid: false, message: 'Title is required' };
  if (title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Title must be less than ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters` 
    };
  }
  return { isValid: true, message: '' };
};

// Document content validation
export const validateDocumentContent = (content) => {
  if (content.length > VALIDATION_RULES.CONTENT_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Content must be less than ${VALIDATION_RULES.CONTENT_MAX_LENGTH} characters` 
    };
  }
  return { isValid: true, message: '' };
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return { isValid: false, message: 'URL is required' };
  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

// Source validation
export const validateSource = (source) => {
  const errors = [];
  
  if (!source.title?.trim()) {
    errors.push('Source title is required');
  }
  
  if (!source.author?.trim()) {
    errors.push('Author is required');
  }
  
  if (!source.year || isNaN(source.year) || source.year < 1900 || source.year > new Date().getFullYear()) {
    errors.push('Please enter a valid year');
  }
  
  if (source.url && !validateUrl(source.url).isValid) {
    errors.push('Please enter a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Research topic validation
export const validateResearchTopic = (topic) => {
  if (!topic?.trim()) {
    return { isValid: false, message: 'Research topic is required' };
  }
  if (topic.length < 3) {
    return { isValid: false, message: 'Research topic must be at least 3 characters' };
  }
  return { isValid: true, message: '' };
};

// Generic form validation
export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    const value = field.value;
    const validators = field.validators || [];
    
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 