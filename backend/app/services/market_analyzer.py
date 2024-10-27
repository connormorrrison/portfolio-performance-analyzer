from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import numpy as np

class MarketAnalyzer:
    def __init__(self):
        self.data = {}
    
    def fetch_stock_data(self, ticker, period="1y"):
        """
        Fetch and analyze stock data
        """
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)

            # DEBUG
            # print(df)
            # print(df.columns)

            # Obtain metrics
            current_open = df["Open"].iloc[-1]
            current_high = df["High"].iloc[-1]
            current_low = df["Low"].iloc[-1]
            current_close = df["Close"].iloc[-1]
            current_volume = df["Volume"].iloc[-1]

            return {
                "symbol": ticker,
                "open": current_open,
                "high": current_high,
                "low": current_low,
                "close": current_close,
                "volume": current_volume
                }
        except Exception as e:
            return {"error": f"Error analyzing {ticker}: {str(e)}"}
        
analyzer = MarketAnalyzer()
result = analyzer.fetch_stock_data("AAPL")
print(result)