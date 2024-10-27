from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import numpy as np

class MarketAnalyzer:
    def __init__(self):
        self.data = {}
    
    def fetch_equity_data(self, ticker, period="1y"):
        """
        Fetch equity data
        """
        try:
            equity = yf.Ticker(ticker)
            df = equity.history(period=period)

            # DEBUG
            # print(df)

            # Obtain metrics
            current_open = df["Open"].iloc[-1]
            current_high = df["High"].iloc[-1]
            current_low = df["Low"].iloc[-1]
            current_close = df["Close"].iloc[-1]
            current_volume = df["Volume"].iloc[-1]

            # Obtain technical indicators
            analysis = self._calculate_technical_indicators(df)

            summary = {
                "symbol": ticker,
                "open": current_open,
                "high": current_high,
                "low": current_low,
                "close": current_close,
                "volume": current_volume
                }
            
            # DEBUG
            # print(summary)

            return summary
        except Exception as e:
            return None, {"error": f"Error analyzing {ticker}: {str(e)}"}
        
    def _calculate_technical_indicators(self, df):
        """
        Calculate technical indicators
        """
        # Copy dataframe to avoid modifications
        analysis = df.copy()

        # Calculate simple moving average (SMA) (20, 50, 100 and 200 days)
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

        print(analysis)

        
analyzer = MarketAnalyzer()
result = analyzer.fetch_equity_data("AAPL")