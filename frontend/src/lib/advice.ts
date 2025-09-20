interface StockEntry {
  ticker: string;
  percentage: number;
}

// Mock historical data for Past-Self Mirror
const mockHistoricalReturns: Record<string, number> = {
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
  'POWERGRID': 1,
  'TESLA': 15,
  'AAPL': 8,
  'GOOGL': 12,
  'MSFT': 10
};

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const generatePastSelfMirror = async (portfolio: StockEntry[]): Promise<{reflections: string[], summary?: string, metrics?: any}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/mirror`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portfolio }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      reflections: data.reflections || [],
      summary: data.summary,
      metrics: data.metrics,
      dataSource: data.dataSource
    };
  } catch (error) {
    console.error('Error fetching past self mirror:', error);
    // Fallback to mock data
    return {
      reflections: portfolio.map(stock => {
        const mockReturn = mockHistoricalReturns[stock.ticker] || Math.floor(Math.random() * 20) - 10;
        const sentiment = mockReturn > 10 ? 'excited' : mockReturn > 0 ? 'satisfied' : 'concerned';
        
        return `Your past self would be ${sentiment}: "If you held ${stock.ticker} at ${stock.percentage}%, you would have seen a ${mockReturn > 0 ? '+' : ''}${mockReturn}% return. ${mockReturn > 10 ? 'Great choice!' : mockReturn > 0 ? 'Not bad, but could be better.' : 'Maybe reconsider this allocation.'}"`;
      }),
      summary: 'Using fallback data - API unavailable',
      dataSource: 'Fallback Mock Data'
    };
  }
};

export const generateAntiAdviceOracle = async (portfolio: StockEntry[]): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const warnings: string[] = [];
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
  const techStocks = portfolio.filter(stock => ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TESLA', 'AAPL', 'GOOGL', 'MSFT'].includes(stock.ticker));
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
  
  return warnings;
};
