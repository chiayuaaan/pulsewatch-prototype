const chartSeries = {
  '24H': {
    labels: ['00', '04', '08', '12', '16', '20', 'Now'],
    actual: [3.94, 3.98, 4.01, 4.05, 4.09, 4.13, 4.2],
    baseline: [6.28, 6.32, 6.35, 6.39, 6.43, 6.47, 6.5],
  },
  '7D': {
    labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    actual: [3.71, 3.79, 3.86, 3.94, 4.02, 4.1, 4.2],
    baseline: [5.82, 5.94, 6.07, 6.18, 6.28, 6.39, 6.5],
  },
  '30D': {
    labels: ['05 Aug', '10 Aug', '15 Aug', '20 Aug', '25 Aug', '30 Aug', '03 Sep'],
    actual: [3.05, 3.19, 3.36, 3.52, 3.72, 3.96, 4.2],
    baseline: [4.2, 4.55, 4.92, 5.31, 5.71, 6.11, 6.5],
  },
};

const width = 760;
const height = 280;
const inset = { left: 52, right: 24, top: 24, bottom: 38 };
const minValue = 2.8;
const maxValue = 6.8;

function toPoints(values) {
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  return values.map((value, index) => ({
    x: inset.left + (index / (values.length - 1)) * plotWidth,
    y: inset.top + ((maxValue - value) / (maxValue - minValue)) * plotHeight,
    value,
  }));
}

function makeCurve(points) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const middle = (previous.x + point.x) / 2;
    return `${path} C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

export function getPulseChartSummary(period) {
  const data = chartSeries[period];
  const current = data.actual[data.actual.length - 1];
  const baseline = data.baseline[data.baseline.length - 1];
  return {
    current,
    baseline,
    difference: baseline - current,
    percentage: Math.round(((baseline - current) / baseline) * 100),
  };
}

export default function AdminPulseChart({ period }) {
  const data = chartSeries[period];
  const actualPoints = toPoints(data.actual);
  const baselinePoints = toPoints(data.baseline);
  const actualPath = makeCurve(actualPoints);
  const baselinePath = makeCurve(baselinePoints);
  const floor = height - inset.bottom;
  const areaPath = `${actualPath} L ${actualPoints.at(-1).x} ${floor} L ${actualPoints[0].x} ${floor} Z`;
  const yTicks = [3, 4, 5, 6];

  return (
    <svg className="admin-pulse-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${period} actual water level compared with seasonal baseline`}>
      <defs>
        <linearGradient id={`adminPulseArea-${period}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef6b2e" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ef6b2e" stopOpacity="0" />
        </linearGradient>
        <filter id="adminPointGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {yTicks.map((tick) => {
        const y = inset.top + ((maxValue - tick) / (maxValue - minValue)) * (height - inset.top - inset.bottom);
        return (
          <g key={tick}>
            <line className="admin-chart-grid" x1={inset.left} x2={width - inset.right} y1={y} y2={y} />
            <text className="admin-chart-axis" x={inset.left - 14} y={y + 4} textAnchor="end">{tick} m</text>
          </g>
        );
      })}

      <path className="admin-chart-area" d={areaPath} fill={`url(#adminPulseArea-${period})`} />
      <path className="admin-chart-baseline" d={baselinePath} pathLength="1" />
      <path className="admin-chart-actual" d={actualPath} pathLength="1" />

      {actualPoints.map((point, index) => (
        <circle className="admin-chart-point" cx={point.x} cy={point.y} r={index === actualPoints.length - 1 ? 5 : 3} key={`${period}-${index}`} />
      ))}
      <circle className="admin-chart-current-ring" cx={actualPoints.at(-1).x} cy={actualPoints.at(-1).y} r="11" filter="url(#adminPointGlow)" />

      {data.labels.map((label, index) => (
        <text
          className="admin-chart-axis"
          x={actualPoints[index].x}
          y={height - 12}
          textAnchor={index === 0 ? 'start' : index === data.labels.length - 1 ? 'end' : 'middle'}
          key={label}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
