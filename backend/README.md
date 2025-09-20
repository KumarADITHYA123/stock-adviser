# Stock Portfolio Backend API

Backend API server for the Stock Portfolio Advisor application.

## Features

- **Past-Self Mirror API**: Provides mock historical reflections
- **Anti-Advice Oracle API**: Generates warnings about what NOT to do
- **Debate Your AI API**: Chat with Gemini AI about investment decisions
- **Usage Tracking API**: Tracks user interactions
- **Health Check**: Server status endpoint

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Past-Self Mirror
- **POST** `/api/mirror`
- Body: `{ "portfolio": [{"ticker": "TCS", "percentage": 30}] }`
- Returns mock historical reflections

### Anti-Advice Oracle
- **POST** `/api/oracle`
- Body: `{ "portfolio": [{"ticker": "TCS", "percentage": 30}] }`
- Returns warnings about what NOT to do

### Debate Your AI
- **POST** `/api/debate`
- Body: `{ "question": "Should I buy more TCS?" }`
- Returns AI response from Gemini

### Usage Tracking
- **POST** `/api/usage`
- Body: `{ "userId": "user123", "action": "portfolio_analysis" }`
- Tracks user interactions

## Tech Stack

- **Node.js** + **Express.js**
- **Google Gemini AI**
- **Firebase Admin** (optional)
- **CORS** enabled for frontend integration

## Development

The server runs on `http://localhost:3001` by default.

All endpoints return JSON responses and include proper error handling.
