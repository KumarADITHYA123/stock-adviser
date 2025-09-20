import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';
import { getPortfolioHistoricalData, calculatePortfolioMetrics } from './services/stockService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Firebase Admin (optional - for server-side operations)
// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   clientId: process.env.FIREBASE_CLIENT_ID,
//   authUri: process.env.FIREBASE_AUTH_URI,
//   tokenUri: process.env.FIREBASE_TOKEN_URI,
// };

// if (process.env.FIREBASE_PRIVATE_KEY) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     projectId: process.env.FIREBASE_PROJECT_ID,
//   });
// }

// Mock historical data for Past-Self Mirror
const mockHistoricalReturns = {
  'TCS': 12,
  'INFY': -5,
  'RELIANCE': 8,
  'HDFC': 15,
  'ICICIBANK': 6,
  'SBIN': -2,
  'WIPRO': 3,
  'BHARTIARTL': 18,
  'ITC': 4,
  'LT': 9,
  'ASIANPAINT': 7,
  'MARUTI': -1,
  'NESTLEIND': 5,
  'BAJFINANCE': 22,
  'HINDUNILVR': 2,
  'KOTAKBANK': 11,
  'AXISBANK': 13,
  'TITAN': 16,
  'ULTRACEMCO': -3,
  'POWERGRID': 1
};

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stock Portfolio Backend is running!' });
});

// Past-Self Mirror API with Real Stock Data
app.post('/api/mirror', async (req, res) => {
  try {
    const { portfolio } = req.body;
    
    if (!portfolio || !Array.isArray(portfolio)) {
      return res.status(400).json({ error: 'Portfolio array is required' });
    }

    console.log('Fetching real historical data for portfolio:', portfolio);
    
    // Get real stock data
    const stockDataArray = await getPortfolioHistoricalData(portfolio);
    const metrics = calculatePortfolioMetrics(stockDataArray);
    
    // Generate reflections based on real data
    const reflections = stockDataArray.map(stock => {
      const sentiment = stock.return > 15 ? 'excited' : 
                       stock.return > 5 ? 'satisfied' : 
                       stock.return > 0 ? 'cautious' : 'concerned';
      
      const advice = stock.return > 15 ? 'Excellent choice!' : 
                    stock.return > 5 ? 'Good pick, but could be better.' : 
                    stock.return > 0 ? 'Decent, but consider alternatives.' : 
                    'Maybe reconsider this allocation.';
      
      return `Your past self would be ${sentiment}: "If you held ${stock.ticker} at ${stock.allocation}%, you would have seen a ${stock.change} return over the past year. Current price: $${stock.price}. ${advice}"`;
    });

    // Add portfolio summary
    const summary = `Portfolio Summary: ${metrics.stockCount} stocks, ${metrics.totalAllocation}% allocated, ${metrics.weightedReturn > 0 ? '+' : ''}${metrics.weightedReturn}% weighted return. Best performer: ${metrics.bestPerformer.ticker} (${metrics.bestPerformer.change}), Worst: ${metrics.worstPerformer.ticker} (${metrics.worstPerformer.change}).`;

    res.json({ 
      reflections,
      summary,
      metrics,
      dataSource: 'Real Stock Data (Alpha Vantage API)',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in mirror API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Anti-Advice Oracle API
app.post('/api/oracle', (req, res) => {
  try {
    const { portfolio } = req.body;
    
    if (!portfolio || !Array.isArray(portfolio)) {
      return res.status(400).json({ error: 'Portfolio array is required' });
    }

    const warnings = [];
    const totalWeight = portfolio.reduce((sum, stock) => sum + stock.percentage, 0);
    
    // Check for over-concentration
    portfolio.forEach(stock => {
      if (stock.percentage > 40) {
        warnings.push(`🚨 Do NOT put more than 40% in ${stock.ticker}. You're over-concentrating risk!`);
      }
      if (stock.percentage > 30) {
        warnings.push(`⚠️ ${stock.ticker} at ${stock.percentage}% is risky. Consider diversifying.`);
      }
    });
    
    // Check for under-diversification
    if (portfolio.length < 3) {
      warnings.push(`❌ Don't put all eggs in ${portfolio.length} basket(s). Diversify across at least 5-7 stocks.`);
    }
    
    // Check for sector concentration (mock check)
    const techStocks = portfolio.filter(stock => ['TCS', 'INFY', 'WIPRO', 'HCLTECH'].includes(stock.ticker));
    if (techStocks.length > 2) {
      warnings.push(`🔴 Don't over-concentrate in tech. You have ${techStocks.length} tech stocks - diversify sectors!`);
    }
    
    // Check for total allocation
    if (totalWeight < 25) {
      warnings.push(`📉 Don't be too conservative. ${totalWeight}% total allocation might miss growth opportunities.`);
    }
    
    // Add general warnings
    warnings.push(`💡 Don't panic sell during market dips.`);
    warnings.push(`🚫 Don't chase hot stocks without research.`);
    warnings.push(`⏰ Don't check your portfolio every day - it leads to emotional decisions.`);

    res.json({ warnings });
  } catch (error) {
    console.error('Error in oracle API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debate Your AI API
app.post('/api/debate', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question string is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are a stock AI coach. The user will argue with you about whether to buy/sell a stock.
Your style:
- Challenge them with 2-3 logical reasons.
- If their argument is strong, concede and say "You might be right, here's a safer approach."
- Keep responses concise (2-3 sentences max).
- Be conversational and slightly confrontational but helpful.
`;

    const result = await model.generateContent([prompt, question]);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Error in debate API:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      fallback: "I'm having trouble processing your question right now. Please try again."
    });
  }
});

// Real-time Stock Data API
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    const stockData = await getRealStockData(symbol);
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Portfolio Analysis API with Real Data
app.post('/api/analyze', async (req, res) => {
  try {
    const { portfolio } = req.body;
    
    if (!portfolio || !Array.isArray(portfolio)) {
      return res.status(400).json({ error: 'Portfolio array is required' });
    }

    const stockDataArray = await getPortfolioHistoricalData(portfolio);
    const metrics = calculatePortfolioMetrics(stockDataArray);
    
    res.json({
      portfolio: stockDataArray,
      metrics,
      analysis: {
        riskLevel: metrics.weightedReturn > 10 ? 'High Risk, High Reward' : 
                  metrics.weightedReturn > 5 ? 'Moderate Risk' : 'Conservative',
        diversification: metrics.stockCount >= 5 ? 'Well Diversified' : 'Needs More Diversification',
        performance: metrics.weightedReturn > 0 ? 'Positive' : 'Negative',
        recommendation: metrics.weightedReturn > 10 ? 'Hold' : 
                       metrics.weightedReturn > 5 ? 'Consider Rebalancing' : 'Review Strategy'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Usage counter API (optional - for server-side tracking)
app.post('/api/usage', (req, res) => {
  try {
    const { userId, action } = req.body;
    
    // Log usage for analytics
    console.log(`Usage tracked: User ${userId} performed ${action} at ${new Date().toISOString()}`);
    
    res.json({ success: true, message: 'Usage tracked successfully' });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stock Portfolio Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});

export default app;
