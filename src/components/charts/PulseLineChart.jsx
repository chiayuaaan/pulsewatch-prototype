export default function PulseLineChart() {
  return (
    <svg className="line-chart" viewBox="0 0 340 122" role="img" aria-label="Current and historical water levels">
      <defs>
        <linearGradient id="currentFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#de7d43" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#de7d43" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="chart-grid" d="M12 24H328 M12 58H328 M12 92H328" />
      <path className="expected-line" d="M12 98 C62 88 74 62 116 54 S185 28 222 25 S284 21 328 15" />
      <path className="actual-fill" d="M12 103 C58 98 78 83 116 80 S174 66 222 64 S286 53 328 49 L328 112 L12 112 Z" />
      <path className="actual-line" d="M12 103 C58 98 78 83 116 80 S174 66 222 64 S286 53 328 49" />
      <circle cx="328" cy="49" r="5" fill="#de7d43" stroke="#fffaf2" strokeWidth="3" />
    </svg>
  );
}
