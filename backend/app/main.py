import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from concurrent.futures import ThreadPoolExecutor
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
executor = ThreadPoolExecutor(max_workers=10)

@app.get("/")
async def read_root():
    return {"status": "active", "service": "Portfolio Performance API"}

@app.get("/api/analyze/{ticker}")
async def analyze_equity(ticker: str):
    """Analyze a single equity"""
    try:
        analysis = await app.state.loop.run_in_executor(
            executor,
            market_analyzer.fetch_equity_data,
            ticker
        )
        
        if "error" in analysis:
            raise HTTPException(status_code=400, detail=analysis["error"])
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/portfolio/analysis")
async def analyze_portfolio(tickers: List[str]):
    """Analyze entire portfolio"""
    try:
        # Run multiple analyses in parallel using thread pool
        futures = []
        for ticker in tickers:
            future = app.state.loop.run_in_executor(
                executor,
                market_analyzer.fetch_equity_data,
                ticker
            )
            futures.append(future)
        
        results = {}
        for ticker, future in zip(tickers, futures):
            results[ticker] = await future
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.on_event("startup")
async def startup_event():
    # Store event loop for use within the thread pool
    app.state.loop = asyncio.get_event_loop()

@app.on_event("shutdown")
def shutdown_event():
    # Clean up the thread pool
    executor.shutdown()