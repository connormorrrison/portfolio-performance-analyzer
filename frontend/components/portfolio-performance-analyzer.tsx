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
  


export default PortfolioPerformanceAnalyzer