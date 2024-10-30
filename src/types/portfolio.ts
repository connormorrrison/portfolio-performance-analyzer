// src/types/portfolio.ts

export interface Holding {
    symbol: string;
    weight: number;
    shares: number;
}

export interface TechnicalSignal {
    rsi: number;
    macd: number;
    signal: number;
    trend: "bullish" | "neutral" | "bearish";
}

export interface RiskMetrics {
    beta: number;
    volatility: number;
    sharpeRatio: number;
    valueAtRisk: number;
}

export interface PerformanceData {
    date: string;
    value: number;
    benchmark: number;
}

