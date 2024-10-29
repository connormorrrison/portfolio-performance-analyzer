"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

const PortfolioPerformanceAnalyzer = () => {
  // Portfolio holdings state with stock selection
  const [newEquity, setNewEquity] = useState("");
  const [newShares, setNewShares] = useState("");
  const [holdings, setHoldings] = useState([
    { symbol: "AAPL", weight: 0.20, shares: 150 },
    { symbol: "NVDA", weight: 0.15, shares: 80 },
    { symbol: "MSFT", weight: 0.20, shares: 120 },
    { symbol: "GOOG", weight: 0.10, shares: 50 },
    { symbol: "AMZN", weight: 0.15, shares: 70 },
    { symbol: "META", weight: 0.20, shares: 200 }
  ]);

  // Function to add a new equity to the portfolio
  const addEquity = () => {
    if (newEquity && newShares) {
      // Calculate current total weight of holdings
      let totalCurrentWeight = 0;
      for (const h of holdings) {
        totalCurrentWeight += h.weight;
      }

      // Calculate remaining portfolio weight 
      const newWeight = 1 - totalCurrentWeight;

      // Add the new equity if there is remaining weight
      if (newWeight > 0) {
        setHoldings([
          ...holdings,
          {
            symbol: newEquity.toUpperCase(),
            shares: parseInt(newShares),
            weight: newWeight
          }
        ]);

        // Clear input fields
        setNewEquity("");
        setNewShares("");
      }
    }
  };

  const removeEquity = (symbolToRemove) => {
    // Filter holdings to remove specified equity
    const newHoldings = []
    for (const h of holdings) {
      if (h.symbol !== symbolToRemove)
        newHoldings.push(h);
    }

    // Calculate the total weight of the remaining holdings
    let totalWeight = 0;
    for (const h of newHoldings) {
      totalWeight += h.weight
    }

    // Rebalance weights of remaining holdings if necessary
    if (totalWeight > 0) {
      for (const h of newHoldings) {
        h.weight = h.weight / totalWeight;
      }
    }

    // Update the holdings state
    setHoldings(newHoldings);
  };

  // Mock technical analysis data (implement later to update from backend)
  const technicalIndicators = {
    "AAPL": { rsi: 65, macd: 2.3, signal: 1.8, trend: "bullish" },
    "NVDA": { rsi: 60, macd: 1.5, signal: 1.2, trend: "bullish" },
    "MSFT": { rsi: 72, macd: 1.2, signal: 1.5, trend: "neutral" },
    "GOOG": { rsi: 45, macd: -0.5, signal: -0.2, trend: "bearish" },
    "AMZN": { rsi: 58, macd: 0.8, signal: 0.6, trend: "bullish" },
    "META": { rsi: 50, macd: 0.3, signal: 0.4, trend: "neutral" }
  };

  // Portfolio performance data (implement later to update from backend)
  const performanceData = [
    { date: '2024-01', value: 100, benchmark: 100 },
    { date: '2024-02', value: 105, benchmark: 103 },
    { date: '2024-03', value: 103, benchmark: 102 },
    { date: '2024-04', value: 108, benchmark: 105 },
    { date: '2024-05', value: 112, benchmark: 107 },
    { date: '2024-06', value: 110, benchmark: 106 },
    { date: '2024-07', value: 115, benchmark: 108 }
  ];

  // Portfolio metrics (implement later to update from backend)
  const riskMetrics = {
    beta: 1.15,
    volatility: 0.22,
    sharpeRatio: 2.1,
    valueAtRisk: 0.15
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Portfolio Intelligence Platform</h1>

      {/* Stock Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Stock Symbol (e.g., AAPL)"
              value={newEquity}
              onChange={(e) => setNewEquity(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Number of Shares"
              type="number"
              value={newShares}
              onChange={(e) => setNewShares(e.target.value)}
              className="w-48"
            />
            <Button onClick={addEquity} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Stock
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Current Portfolio: {holdings.map(h => h.symbol).join(', ')}
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.beta.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(riskMetrics.volatility * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.sharpeRatio.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(riskMetrics.valueAtRisk * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Portfolio Performance vs Benchmark</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Portfolio" stroke="#8884d8" />
                <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding) => {
              const signals = technicalIndicators[holding.symbol] || {
                rsi: 50,
                macd: 0,
                signal: 0,
                trend: 'neutral'
              };
              return (
                <div key={holding.symbol} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{holding.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquity(holding.symbol)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      signals.trend === 'bullish' ? 'bg-green-100 text-green-800' :
                      signals.trend === 'bearish' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {signals.trend.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">RSI</div>
                      <div className="font-medium">{signals.rsi}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">MACD</div>
                      <div className="font-medium">{signals.macd}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Signal</div>
                      <div className="font-medium">{signals.signal}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trading Signals / Alerts */}
      <div className="space-y-4">
        {holdings.map((holding) => {
          const signals = technicalIndicators[holding.symbol];
          if (signals && (signals.rsi > 70 || signals.rsi < 30)) {
            return (
              <Alert key={holding.symbol} variant={signals.rsi > 70 ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{holding.symbol} RSI Alert</AlertTitle>
                <AlertDescription>
                  RSI is {signals.rsi > 70 ? "overbought" : "oversold"} at {signals.rsi}
                </AlertDescription>
              </Alert>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default PortfolioPerformanceAnalyzer;