// src/components/PortfolioPerformanceAnalyzer.tsx

"use client";

import { use, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, Plus, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Holding, TechnicalIndicators, RiskMetrics, PerformanceData } from "@/types/portfolio";

export function PortfolioPerformanceAnalyzer() {
    const [newStock, setNewStock] = useState("");
    const [newShares, setNewShares] = useState("");
    const [holdings, setHoldings] = useState<Holding[]>([
        { symbol: "AAPL", weight: 0.25, shares: 100 },
        { symbol: "MSFT", weight: 0.25, shares: 85 },
        { symbol: "GOOGL", weight: 0.20, shares: 20 },
        { symbol: "AMZN", weight: 0.15, shares: 30 },
        { symbol: "BRK.B", weight: 0.15, shares: 50 }
    ]);

    const technicalIndicators: Record<string, TechnicalIndicators> = {
        "AAPL": { rsi: 65, macd: 2.3, signal: 1.8, trend: "bullish" },
        "MSFT": { rsi: 72, macd: 1.2, signal: 1.5, trend: "neutral" },
        "GOOGL": { rsi: 45, macd: -0.5, signal: -0.2, trend: "bearish" },
        "AMZN": { rsi: 58, macd: 0.8, signal: 0.6, trend: "bullish" },
        "BRK.B": { rsi: 52, macd: 0.1, signal: 0.2, trend: "neutral" }
    };

    const performanceData: PerformanceData[] = [
        { date: "2024-01", value: 100, benchmark: 100 },
        { date: "2024-02", value: 105, benchmark: 103 },
        { date: "2024-03", value: 103, benchmark: 102 },
        { date: "2024-04", value: 108, benchmark: 105 },
        { date: "2024-05", value: 112, benchmark: 107 },
        { date: "2024-06", value: 110, benchmark: 106 },
        { date: "2024-07", value: 115, benchmark: 108 }
    ];

    const riskMetrics: RiskMetrics = {
        beta: 1.1578,
        volatility: 0.2227,
        sharpeRatio: 2.1162,
        valueAtRisk: 0.1576
    };

    const addStock = () => {
        if (newStock && newShares) {
            // Calculate total weight of the portfolio
            let totalCurrentWeight = 0;
            for (const h of holdings) {
                totalCurrentWeight += h.weight;
            }

            // Calculate the new weight for the added stock
            const newWeight = 1 - totalCurrentWeight;

            if (newWeight > 0) {
                setHoldings([
                    ...holdings,
                    {
                        symbol: newStock.toUpperCase(),
                        shares: parseInt(newShares),
                        weight: newWeight
                    }
                ]);
                setNewStock("");
                setNewShares("");
            }
        }
    };

    const removeStock = (symbolToRemove: string) => {
        const updatedHoldings = [];
        let totalWeight = 0;

        // Create updatedHoldings array
        for (const h of holdings) {
            if (h.symbol != symbolToRemove) {
                updatedHoldings.push({...h});
                totalWeight += h.weight;
            }
        }

        // Normalize weights
        if (totalWeight > 0) {
            for (const h of holdings) {
                h.weight = h.weight / totalWeight;
            }
        }

        setHoldings(updatedHoldings);
    };

    return(
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Input 
                            placeholder="Stock Symbol (e.g., AAPL)"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-48"
                        />
                        <Input
                            placeholder="Number of Shares"
                            type="number"
                            value={newShares}
                            onChange={(e) => setNewShares(e.target.value)}
                            className="w-48"
                        />
                        <Button onClick={addStock} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Stock
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Current Portfolio: {holdings.map(h => h.symbol).join(", ")}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1: md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            {(riskMetrics.valueAtRisk * 100).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Performance vs Benchmark</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Portfolio" stroke="#8884d8" />
                                <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
