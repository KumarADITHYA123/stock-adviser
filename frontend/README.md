# Stock Portfolio Advisor

A modern React application that provides AI-powered investment advice for stock portfolios.

## Features

- **Portfolio Analysis**: Enter stock tickers with allocation percentages
- **Past-Self Mirror**: Real historical data analysis with Alpha Vantage API
- **Anti-Advice Oracle**: Risk warnings and what NOT to do
- **AI Debate**: Chat with Gemini AI about investment decisions
- **Usage Tracking**: Firebase-powered usage counter

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express + Alpha Vantage API
- **AI**: Google Gemini API
- **Database**: Firebase Firestore

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start development server:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AdviceCards.tsx # Main advice display
│   ├── PortfolioForm.tsx # Portfolio input form
│   └── UsageCounter.tsx # Usage tracking
├── lib/                # Utility libraries
│   ├── advice.ts       # Advice generation logic
│   ├── firebase.ts     # Firebase configuration
│   ├── firebaseService.ts # Firebase operations
│   ├── gemini.ts       # Gemini AI integration
│   └── utils.ts        # General utilities
├── pages/              # Page components
│   ├── Index.tsx       # Main page
│   └── NotFound.tsx    # 404 page
└── hooks/              # Custom React hooks
```

## API Integration

- **Alpha Vantage**: Real stock market data
- **Google Gemini**: AI-powered investment advice
- **Firebase**: Data persistence and user tracking

## License

MIT