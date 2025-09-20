import React, { useState, useEffect } from 'react';
import PortfolioForm from '@/components/PortfolioForm';
import AdviceCards from '@/components/AdviceCards';
import UsageCounter from '@/components/UsageCounter';
import { 
  incrementUsageCounter, 
  getUsageCount, 
  savePortfolio, 
  generateUserId 
} from '@/lib/firebaseService';

interface StockEntry {
  ticker: string;
  percentage: number;
}

const Index = () => {
  const [portfolio, setPortfolio] = useState<StockEntry[] | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [userId] = useState(() => generateUserId());

  // Load usage count from Firebase on component mount
  useEffect(() => {
    const loadUsageCount = async () => {
      try {
        const count = await getUsageCount(userId);
        setUsageCount(count);
      } catch (error) {
        console.error('Error loading usage count:', error);
        // Fallback to localStorage
        const savedCount = localStorage.getItem('portfolio-usage-count');
        if (savedCount) {
          setUsageCount(parseInt(savedCount, 10));
        }
      }
    };

    loadUsageCount();
  }, [userId]);

  const handlePortfolioSubmit = async (newPortfolio: StockEntry[]) => {
    setPortfolio(newPortfolio);
    
    try {
      // Increment usage counter in Firebase
      const newCount = await incrementUsageCounter(userId);
      setUsageCount(newCount);
      
      // Save portfolio to Firebase
      await savePortfolio(userId, newPortfolio);
    } catch (error) {
      console.error('Error updating usage counter:', error);
      // Fallback to localStorage
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('portfolio-usage-count', newCount.toString());
    }
  };

  const resetPortfolio = () => {
    setPortfolio(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">Stock Portfolio Advisor</h1>
          <p className="text-muted-foreground text-center mt-2">
            Get personalized advice for your investment portfolio
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Usage Counter */}
        <UsageCounter count={usageCount} />

        {!portfolio ? (
          /* Portfolio Form */
          <PortfolioForm onSubmit={handlePortfolioSubmit} />
        ) : (
          /* Advice Section */
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Your Portfolio Analysis</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {portfolio.map((stock, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-primary-foreground"
                  >
                    {stock.ticker}: {stock.percentage}%
                  </span>
                ))}
              </div>
              <button
                onClick={resetPortfolio}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Analyze a different portfolio
              </button>
            </div>

            {/* Advice Cards */}
            <AdviceCards portfolio={portfolio} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by Gemini AI + Firebase • Portfolio advice generated {usageCount} times</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
