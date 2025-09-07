// API Configuration utility
// Handles switching between local and production backend

export const getApiUrl = () => {
  // Check if we're in development and have a custom API URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to production
  return 'https://propmatch-backend-1077352833070.us-central1.run.app';
};

export const isDebugMode = () => {
  return process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
};

// Enhanced logging utility
export const apiLogger = {
  log: (message, data = null) => {
    if (isDebugMode()) {
      console.log(`🔧 [API Debug] ${message}`, data || '');
    }
  },
  
  error: (message, error = null) => {
    if (isDebugMode()) {
      console.error(`❌ [API Error] ${message}`, error || '');
    }
  },
  
  request: (method, url, data = null) => {
    if (isDebugMode()) {
      console.group(`📡 [API Request] ${method.toUpperCase()} ${url}`);
      if (data) console.log('Request data:', data);
      console.groupEnd();
    }
  },
  
  response: (status, data = null) => {
    if (isDebugMode()) {
      console.group(`✅ [API Response] Status: ${status}`);
      if (data) console.log('Response data:', data);
      console.groupEnd();
    }
  }
};

export default {
  getApiUrl,
  isDebugMode,
  apiLogger
};
