# 🚀 Stock Portfolio Advisor

A sophisticated full-stack application that provides personalized investment advice through three unique AI-powered perspectives. Built with modern technologies and real-time stock data integration.

## 🎯 Overview

This application helps investors make better decisions by providing three distinct types of advice:
- **Past-Self Mirror**: Historical analysis using real stock data
- **Anti-Advice Oracle**: Risk warnings and what NOT to do
- **Debate Your AI**: Interactive chat with Google Gemini AI

## 📁 Project Structure

```
stock-portfolio-advisor/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility libraries
│   │   ├── pages/        # Page components
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
├── backend/           # Node.js + Express API server
│   ├── services/      # Business logic services
│   └── server.js      # Main server file
└── README.md         # This file
```

## ✨ Features

### 🎯 Core Functionality
- **Smart Portfolio Form**: Enter stock tickers with allocation percentages (minimum 25% per stock)
- **Past-Self Mirror**: Real historical data analysis from Alpha Vantage API with portfolio performance metrics
- **Anti-Advice Oracle**: Intelligent risk warnings and diversification advice
- **Debate Your AI**: Interactive chat with Google Gemini AI to challenge investment decisions
- **Usage Counter**: Firebase-powered tracking of advice generation
- **Real-Time Data**: Live integration with Alpha Vantage API for accurate stock information
- **Portfolio Analytics**: Weighted returns, best/worst performers, risk assessment

### 🛠️ Tech Stack

**Frontend:**
- **React 18** + **TypeScript** + **Vite** for fast development
- **shadcn/ui** components + **Tailwind CSS** for modern UI
- **Firebase** integration for data persistence
- **React Router** for navigation
- **TanStack Query** for state management

**Backend:**
- **Node.js** + **Express.js** for robust API server
- **Google Gemini AI** integration for intelligent conversations
- **Alpha Vantage Stock API** for real-time market data
- **Firebase Admin SDK** for backend data operations
- **CORS** enabled for seamless frontend integration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Alpha Vantage API key** ([Free tier available](https://www.alphavantage.co/support/#api-key))

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
PORT=3001
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

## 📡 API Endpoints

### Backend API (`http://localhost:3001`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `POST` | `/api/mirror` | Past-Self Mirror with real stock data |
| `POST` | `/api/oracle` | Anti-Advice Oracle warnings |
| `POST` | `/api/debate` | AI debate responses via Gemini |
| `GET` | `/api/stock/:symbol` | Real-time stock data for specific symbol |
| `POST` | `/api/analyze` | Complete portfolio analysis |
| `POST` | `/api/usage` | Usage tracking |

### Example API Usage

```javascript
// Get portfolio analysis
const response = await fetch('http://localhost:3001/api/mirror', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    portfolio: [
      { ticker: 'AAPL', percentage: 40 },
      { ticker: 'TSLA', percentage: 30 },
      { ticker: 'GOOGL', percentage: 30 }
    ]
  })
});
```

## 🔧 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Deployment

### Netlify (Frontend)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard:
   - `VITE_API_BASE_URL` (your backend URL)
   - `VITE_GEMINI_API_KEY`

### Railway/Heroku (Backend)
1. Deploy the backend directory
2. Add environment variables:
   - `GEMINI_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `PORT` (usually auto-assigned)
3. Update frontend API URL for production

## 📝 Usage Guide

### 1. Portfolio Entry
- Enter stock tickers (e.g., TCS, INFY, RELIANCE, AAPL, TSLA)
- Set allocation percentages (minimum 25% per stock)
- Submit to generate advice

### 2. Advice Types
- **Past-Self Mirror**: See how your portfolio would have performed historically
- **Anti-Advice Oracle**: Get warnings about risks and diversification
- **Debate Your AI**: Chat with AI about your investment decisions

### 3. Features
- Real-time stock data from Alpha Vantage
- Firebase-powered usage tracking
- Responsive design for all devices
- Professional UI with shadcn/ui components

## 🎯 Key Features

- ✅ **Real Stock Data**: Alpha Vantage API integration
- ✅ **AI-Powered Advice**: Google Gemini AI for intelligent conversations
- ✅ **Portfolio Validation**: Smart validation with 25% minimum per stock
- ✅ **Three Advice Cards**: Past-Self Mirror, Anti-Advice Oracle, Debate AI
- ✅ **Firebase Backend**: Persistent usage tracking and data storage
- ✅ **Modern UI**: Responsive design with Tailwind CSS
- ✅ **Production Ready**: Proper error handling and fallbacks
- ✅ **TypeScript**: Full type safety throughout the application

## 🔑 API Keys Setup

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to both frontend and backend `.env` files

### Alpha Vantage API
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for free tier (500 requests/day)
3. Add to backend `.env` file

## 📊 Project Status

- ✅ **Frontend**: Complete with React + TypeScript
- ✅ **Backend**: Complete with Express + Gemini AI
- ✅ **Real Stock Data**: Alpha Vantage API integrated
- ✅ **AI Integration**: Google Gemini AI working
- ✅ **Firebase Integration**: Data persistence complete
- ✅ **UI/UX**: Modern, responsive design
- ✅ **Deployment Ready**: Production-ready configuration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External APIs │
│   (React)       │◄──►│   (Express)     │◄──►│                 │
│                 │    │                 │    │ • Gemini AI     │
│ • Portfolio Form│    │ • API Routes    │    │ • Alpha Vantage │
│ • Advice Cards  │    │ • Stock Service │    │ • Firebase      │
│ • Usage Counter │    │ • AI Service    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent conversation capabilities
- **Alpha Vantage** for real-time stock market data
- **Firebase** for backend services
- **shadcn/ui** for beautiful UI components
- **Vite** for fast development experience

---

**Ready to deploy!** 🎉 

This project demonstrates a complete full-stack application with real AI integration, live stock data, and modern web technologies. Perfect for showcasing your development skills to judges or potential employers.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.