from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from .services.market_analyzer import MarketAnalyzer

app = FastAPI(title="Portfolio Performance App")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize services
market_analyzer = MarketAnalyzer()

@app.get("/")
async def read_root():
    return {"status": "active", "service": "Portfolio Performance API"}

@app.get("/api/analyze/{ticker}")
async def analyze_equity(ticker: str):
    try:
        analysis = await market_analyzer.fetch_equity_data(ticker)
        if "error" in analysis:
            raise HTTPException(status_code=400, detail=analysis["error"])
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/portfolio/analysis")
async def analyze_portfolio(tickers: List[str]):
    """
    Analyze entire portfolio
    """
    try:
        results = {}
        for ticker in tickers:
            results[ticker] = await market_analyzer.fetch_equity_data(ticker)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
