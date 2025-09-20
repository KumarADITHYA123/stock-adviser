import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, MessageCircle, Send, Loader2 } from 'lucide-react';
import { generatePastSelfMirror, generateAntiAdviceOracle } from '@/lib/advice';
import { generateDebateResponse } from '@/lib/gemini';

interface StockEntry {
  ticker: string;
  percentage: number;
}

interface AdviceCardsProps {
  portfolio: StockEntry[];
}

const AdviceCards: React.FC<AdviceCardsProps> = ({ portfolio }) => {
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; message: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pastSelfReflections, setPastSelfReflections] = useState<string[]>([]);
  const [antiAdviceWarnings, setAntiAdviceWarnings] = useState<string[]>([]);
  const [adviceLoading, setAdviceLoading] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('');

  // Load advice data when portfolio changes
  React.useEffect(() => {
    const loadAdvice = async () => {
      setAdviceLoading(true);
      try {
        const [mirrorData, warnings] = await Promise.all([
          generatePastSelfMirror(portfolio),
          generateAntiAdviceOracle(portfolio)
        ]);
        setPastSelfReflections(mirrorData.reflections);
        setPortfolioSummary(mirrorData.summary || '');
        setDataSource(mirrorData.dataSource || '');
        setAntiAdviceWarnings(warnings);
      } catch (error) {
        console.error('Error loading advice:', error);
      } finally {
        setAdviceLoading(false);
      }
    };

    loadAdvice();
  }, [portfolio]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    const userMessage = { role: 'user' as const, message: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      const aiResponse = await generateDebateResponse(currentMessage);
      setChatMessages(prev => [...prev, { role: 'ai' as const, message: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatMessages(prev => [...prev, { 
        role: 'ai' as const, 
        message: "I'm having trouble processing your question right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto">
      {/* Past-Self Mirror */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Past-Self Mirror
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adviceLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">Loading reflections...</span>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {pastSelfReflections.map((reflection, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm italic">{reflection}</p>
                  </div>
                ))}
              </div>
              {portfolioSummary && (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm font-medium text-blue-800">Portfolio Summary:</p>
                  <p className="text-sm text-blue-700">{portfolioSummary}</p>
                </div>
              )}
              <Badge variant="secondary" className="w-fit">
                {dataSource || 'Based on historical data'}
              </Badge>
            </>
          )}
        </CardContent>
      </Card>

      {/* Anti-Advice Oracle */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Anti-Advice Oracle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium">What NOT to do:</p>
          {adviceLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">Loading warnings...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {antiAdviceWarnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{warning}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debate Your AI */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Debate Your AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Argue with me about one of your stock decisions. I'll defend or challenge your choices!
              </p>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'bg-muted mr-4'
                  }`}
                >
                  <p className="font-medium text-xs mb-1">
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </p>
                  <p>{msg.message}</p>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Challenge my picks..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Gemini AI - Challenge my advice!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdviceCards;