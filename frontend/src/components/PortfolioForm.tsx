import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface StockEntry {
  ticker: string;
  percentage: number;
}

interface PortfolioFormProps {
  onSubmit: (portfolio: StockEntry[]) => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit }) => {
  const [stocks, setStocks] = useState<StockEntry[]>([
    { ticker: '', percentage: 0 }
  ]);

  const addStock = () => {
    setStocks([...stocks, { ticker: '', percentage: 0 }]);
  };

  const removeStock = (index: number) => {
    if (stocks.length > 1) {
      setStocks(stocks.filter((_, i) => i !== index));
    }
  };

  const updateStock = (index: number, field: keyof StockEntry, value: string | number) => {
    const updated = stocks.map((stock, i) => 
      i === index ? { ...stock, [field]: value } : stock
    );
    setStocks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validStocks = stocks.filter(stock => stock.ticker && stock.percentage >= 25);
    
    if (validStocks.length === 0) {
      alert('Please add at least one stock with a valid ticker and percentage (minimum 25%).');
      return;
    }
    
    onSubmit(validStocks);
  };

  const totalPercentage = stocks.reduce((sum, stock) => sum + (stock.percentage || 0), 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Build Your Portfolio</CardTitle>
        <p className="text-muted-foreground text-center">Enter stock tickers and their allocation percentages</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {stocks.map((stock, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor={`ticker-${index}`}>Stock Ticker</Label>
                <Input
                  id={`ticker-${index}`}
                  placeholder="e.g., TCS, INFY, RELIANCE"
                  value={stock.ticker}
                  onChange={(e) => updateStock(index, 'ticker', e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`percentage-${index}`}>%</Label>
                <Input
                  id={`percentage-${index}`}
                  type="number"
                  min="25"
                  max="100"
                  step="0.1"
                  placeholder="25"
                  value={stock.percentage || ''}
                  onChange={(e) => updateStock(index, 'percentage', parseFloat(e.target.value) || 0)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeStock(index)}
                disabled={stocks.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2">
            <Button type="button" variant="outline" onClick={addStock}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
            <div className="text-sm font-medium text-muted-foreground">
              Total: {totalPercentage.toFixed(1)}%
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={totalPercentage === 0}
          >
            Get Portfolio Advice
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;