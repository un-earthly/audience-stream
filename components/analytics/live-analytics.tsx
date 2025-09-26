"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Mail, MousePointer, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MetricData {
  openRate: number;
  clickRate: number;
  conversionRate: number;
  totalReach: number;
  trend: 'up' | 'down' | 'stable';
}

export function LiveAnalytics() {
  const [metrics, setMetrics] = useState<MetricData>({
    openRate: 24.5,
    clickRate: 8.2,
    conversionRate: 2.1,
    totalReach: 4600,
    trend: 'up'
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        openRate: Math.max(0, prev.openRate + (Math.random() - 0.5) * 2),
        clickRate: Math.max(0, prev.clickRate + (Math.random() - 0.5) * 1),
        conversionRate: Math.max(0, prev.conversionRate + (Math.random() - 0.5) * 0.5),
        totalReach: prev.totalReach + Math.floor(Math.random() * 50),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMetrics({
      openRate: 20 + Math.random() * 15,
      clickRate: 5 + Math.random() * 10,
      conversionRate: 1 + Math.random() * 3,
      totalReach: 4000 + Math.floor(Math.random() * 2000),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    });
    
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Campaign Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{metrics.openRate.toFixed(1)}%</div>
              <Badge variant={metrics.trend === 'up' ? 'default' : 'secondary'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.trend === 'up' ? '+' : '-'}2.1%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{metrics.clickRate.toFixed(1)}%</div>
              <Badge variant={metrics.trend === 'up' ? 'default' : 'secondary'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.trend === 'up' ? '+' : '-'}1.3%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
              <Badge variant={metrics.trend === 'up' ? 'default' : 'secondary'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.trend === 'up' ? '+' : '-'}0.8%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{formatNumber(metrics.totalReach)}</div>
              <Badge variant="default">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              active users
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}