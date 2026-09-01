export default function ForecastGraph({ range }) {
  const paths = {
    week: 'M18 120 C70 108 88 91 132 84 S208 65 256 57 S307 47 342 39',
    month: 'M18 118 C58 112 84 100 119 94 S173 77 215 78 S285 57 342 48',
    season: 'M18 116 C58 106 84 93 119 90 S177 76 215 82 S281 89 342 102',
  };
  return (
    <svg className="forecast-graph" viewBox="0 0 360 168" role="img" aria-label="Forecast pulse strength">
      <defs>
        <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5f8e90" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#5f8e90" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="forecast-grid" d="M18 35H342 M18 78H342 M18 121H342" />
      <path className="forecast-average" d="M18 115 C70 92 107 56 155 43 S245 31 342 26" />
      <path className="forecast-area" d={`${paths[range]} L342 145 L18 145 Z`} />
      <path className="forecast-path" d={paths[range]} />
      <line x1="116" y1="18" x2="116" y2="145" className="today-line" />
      <text x="104" y="13" className="today-label">TODAY</text>
    </svg>
  );
}
