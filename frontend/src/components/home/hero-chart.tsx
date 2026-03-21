import React, { useEffect, useRef, memo } from 'react';

interface HeroChartProps {
  symbol?: string; // default BTCUSDT
  theme?: 'light' | 'dark'; 
}

const HeroChart: React.FC<HeroChartProps> = ({
  symbol = 'BINANCE:BTCUSDT',
  theme = 'dark'
}) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous script
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1", // 1 = Candlesticks
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": false, // Shows D, W, M selectors
      "hide_side_toolbar": true, // Hides drawing tools for a cleaner look
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    container.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-[calc(100%-32px)] w-full"></div>
      {/* Optional: Remove copyright if your license permits, or keep it subtle */}
      <div className="tradingview-widget-copyright hidden">
        <a href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(HeroChart);
