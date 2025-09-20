import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface UsageCounterProps {
  count: number;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ count }) => {
  return (
    <Card className="w-fit mx-auto">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Advice Generated</p>
            <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
              {count}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageCounter;