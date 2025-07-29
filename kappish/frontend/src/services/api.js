import { API_CONFIG, ERROR_MESSAGES } from '../config/constants';

// API request configuration
const API_REQUEST_CONFIG = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Request interceptor for authentication
const addAuthHeader = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || ERROR_MESSAGES.UNKNOWN_ERROR);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const config = {
      ...API_REQUEST_CONFIG,
      ...options,
      headers: {
        ...API_REQUEST_CONFIG.headers,
        ...options.headers,
      }
    };

    // Add auth header
    const configWithAuth = addAuthHeader(config);

    const response = await fetch(`${API_REQUEST_CONFIG.baseURL}${endpoint}`, configWithAuth);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

// API service methods
export const apiService = {
  // Health check
  healthCheck: () => apiRequest(API_ENDPOINTS.HEALTH),

  // Authentication
  login: (credentials) => apiRequest(`${API_ENDPOINTS.AUTH}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  register: (userData) => apiRequest(`${API_ENDPOINTS.AUTH}/register`, {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  logout: () => apiRequest(`${API_ENDPOINTS.AUTH}/logout`, {
    method: 'POST'
  }),

  // Documents
  getDocuments: () => apiRequest(`${API_ENDPOINTS.DOCUMENTS}`),

  getDocument: (id) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}/${id}`),

  createDocument: (documentData) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}`, {
    method: 'POST',
    body: JSON.stringify(documentData)
  }),

  updateDocument: (id, documentData) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(documentData)
  }),

  deleteDocument: (id) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
    method: 'DELETE'
  }),

  // AI Services
  analyzeDocument: (documentId, content) => apiRequest(`${API_ENDPOINTS.AI}/analyze`, {
    method: 'POST',
    body: JSON.stringify({ documentId, content })
  }),

  generateCitations: (sources, style) => apiRequest(`${API_ENDPOINTS.AI}/citations`, {
    method: 'POST',
    body: JSON.stringify({ sources, style })
  }),

  checkPlagiarism: (content) => apiRequest(`${API_ENDPOINTS.AI}/plagiarism`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }),

  researchTopic: (topic) => apiRequest(`${API_ENDPOINTS.AI}/research`, {
    method: 'POST',
    body: JSON.stringify({ topic })
  }),

  // Real-time features
  joinDocument: (documentId) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/join`, {
    method: 'POST'
  }),

  leaveDocument: (documentId) => apiRequest(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/leave`, {
    method: 'POST'
  })
};

// Error handler utility
export const handleApiError = (error, fallbackMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  console.error('API Error:', error);
  
  if (error.message === ERROR_MESSAGES.NETWORK_ERROR) {
    return { type: 'network', message: ERROR_MESSAGES.NETWORK_ERROR };
  }
  
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return { type: 'auth', message: ERROR_MESSAGES.AUTH_ERROR };
  }
  
  if (error.message.includes('404')) {
    return { type: 'notFound', message: ERROR_MESSAGES.DOCUMENT_NOT_FOUND };
  }
  
  return { type: 'general', message: error.message || fallbackMessage };
};

// Rate limiting utility
export const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
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