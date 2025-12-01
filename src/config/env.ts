import { API_BASE_URL, ENVIRONMENT } from '@env';

export const config = {
  // Using Mac's actual IP address - works for both emulator and physical devices
  apiBaseUrl: API_BASE_URL || 'http://10.40.149.228:5001/api',
  environment: ENVIRONMENT || 'development',
  isDevelopment: ENVIRONMENT === 'development',
  isProduction: ENVIRONMENT === 'production',
  isStaging: ENVIRONMENT === 'staging',
} as const;

// Validate required env vars
if (!config.apiBaseUrl) {
  console.warn('⚠️ API_BASE_URL is not defined in .env, using default');
}

// Log current environment (only in development)
if (config.isDevelopment) {
  console.log('🔧 Environment:', config.environment);
  console.log('🌐 API Base URL:', config.apiBaseUrl);
}
