from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import numpy as np

class MarketAnalyzer:
    def __init__(self):
        self.data = {}
    
    def fetch_equity_data(self, ticker: str, period: str = "1y"):
        """Fetch equity data"""
        try:
            equity = yf.Ticker(ticker)
            df = equity.history(period=period)

            # Obtain metrics
            current_open = df["Open"].iloc[-1]
            current_high = df["High"].iloc[-1]
            current_low = df["Low"].iloc[-1]
            current_close = df["Close"].iloc[-1]
            current_volume = df["Volume"].iloc[-1]

            # Calculate volatility
            volatility = df["Close"].pct_change().std() * np.sqrt(252)

            # Obtain technical indicators
            indicators = self._calculate_technical_indicators(df)
            sma_20 = indicators["SMA_20"].iloc[-1]
            sma_50 = indicators["SMA_50"].iloc[-1]
            sma_100 = indicators["SMA_100"].iloc[-1]
            sma_200 = indicators["SMA_200"].iloc[-1]
            rsi = indicators["RSI"].iloc[-1]
            macd = indicators["MACD"].iloc[-1]
            signal_line = indicators["Signal_Line"].iloc[-1]
            trend = self._calculate_trend(indicators)

            # Dictionary containing metrics, volatility and technical indicators
            return {
                "symbol": ticker,
                "open": float(current_open),
                "high": float(current_high),
                "low": float(current_low),
                "close": float(current_close),
                "volume": float(current_volume),
                "volatility": float(volatility),
                "sma_20": float(sma_20),
                "sma_50": float(sma_50),
                "sma_100": float(sma_100),
                "sma_200": float(sma_200),
                "rsi": float(rsi),
                "macd": float(macd),
                "signal_line": float(signal_line),
                "trend": trend
            }
        except Exception as e:
            return {"error": f"Error analyzing {ticker}: {str(e)}"}
        
    def _calculate_technical_indicators(self, df):
        """Calculate technical indicators"""
        # Copy dataframe to avoid modifications
        analysis = df.copy()

        # Calculate simple moving average (SMA)
        analysis["SMA_20"] = analysis["Close"].rolling(window=20).mean()
        analysis["SMA_50"] = analysis["Close"].rolling(window=50).mean()
        analysis["SMA_100"] = analysis["Close"].rolling(window=100).mean()
        analysis["SMA_200"] = analysis["Close"].rolling(window=200).mean()

        # Calculate relative strength index (RSI)
        delta = analysis["Close"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        analysis["RSI"] = 100 - (100 / (1 + rs))

        # Calulate moving average convergence divergence (MACD)
        ema_12 = analysis["Close"].ewm(span=12, adjust=False).mean()
        ema_26 = analysis["Close"].ewm(span=26, adjust=False).mean()
        analysis["MACD"] = ema_12 - ema_26
        analysis["Signal_Line"] = analysis["MACD"].ewm(span=9, adjust=False).mean()

        return analysis
    
    def _calculate_trend(self, indicators):
        """Calculate overall trend based on technical indicators"""
        last_row = indicators.iloc[-1]

        # Extract values for trend indicators
        sma_20 = last_row["SMA_20"]
        sma_50 = last_row["SMA_50"]
        rsi = last_row["RSI"]
        macd = last_row["MACD"]
        signal_line = last_row["Signal_Line"]

        # Calculate trend
        if macd > signal_line and rsi > 50 and sma_20 > sma_50:
            return "bullish"
        elif macd < signal_line and rsi < 50 and sma_20 < sma_50:
            return "bearish"
        return "neutral"
    