// Backend Environment Configuration
// Copy this to .env file in the backend directory

export const envConfig = {
  // Gemini API Key
  GEMINI_API_KEY: 'your_gemini_api_key_here',
  
  // Server Configuration
  PORT: '3001',
  NODE_ENV: 'development',
  
  // Firebase Admin Configuration (optional)
  FIREBASE_PROJECT_ID: 'stock-adviser-9e1c4',
  FIREBASE_PRIVATE_KEY_ID: 'your_private_key_id',
  FIREBASE_PRIVATE_KEY: 'your_private_key',
  FIREBASE_CLIENT_EMAIL: 'your_client_email',
  FIREBASE_CLIENT_ID: 'your_client_id',
  FIREBASE_AUTH_URI: 'https://accounts.google.com/o/oauth2/auth',
  FIREBASE_TOKEN_URI: 'https://oauth2.googleapis.com/token'
};

// Instructions:
// 1. Create a .env file in the backend directory
// 2. Copy the values above to your .env file
// 3. Replace 'your_*' values with actual Firebase admin credentials if needed
