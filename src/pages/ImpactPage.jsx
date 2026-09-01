import { ArrowLeft, BookOpen, Database, Fish, Landmark, Waves } from 'lucide-react';
import { impactMetrics } from '../data/mockData';

function ImpactTrendChart() {
  return (
    <svg className="impact-trend-chart" viewBox="0 0 350 170" role="img" aria-label="Historical and projected reverse flow volume">
      <defs>
        <linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b85546" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#b85546" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="forecast-grid" d="M18 28H334 M18 75H334 M18 122H334" />
      <path className="impact-area" d="M18 31 C73 39 104 54 147 63 S217 89 254 107 S305 129 334 139 L334 151 L18 151 Z" />
      <path className="impact-line" d="M18 31 C73 39 104 54 147 63 S217 89 254 107 S305 129 334 139" />
      <line x1="169" y1="16" x2="169" y2="151" className="today-line" />
      <text x="157" y="12" className="today-label">2026</text>
      <text x="18" y="165">2018</text><text x="158" y="165">TODAY</text><text x="313" y="165">2038</text>
    </svg>
  );
}

export default function ImpactPage({ onNavigate }) {
  return (
    <div className="page impact-page">
      <button className="back-button" onClick={() => onNavigate('more')} type="button"><ArrowLeft size={17} /> Back to explore</button>
      <div className="section-heading">
        <div><span className="eyebrow">WHY PULSEWATCH MATTERS</span><h1>Turn invisible loss<br />into shared evidence.</h1></div>
      </div>
      <section className="impact-metric-grid">
        {impactMetrics.map((metric) => (
          <article className={`impact-metric ${metric.tone}`} key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>
        ))}
      </section>

      <section className="data-card impact-chart-card">
        <div className="section-heading compact">
          <div><span className="eyebrow">REVERSE-FLOW VOLUME</span><h2>Observed decline and projection</h2></div>
        </div>
        <ImpactTrendChart />
        <div className="projection-note"><span>Projected change by 2038</span><strong>−69%</strong></div>
      </section>

      <section className="evidence-stack">
        <article><span><Database size={20} /></span><div><small>MEASURE</small><h3>Community gauge network</h3><p>Frequent, public water-level readings make the changing pulse visible.</p></div></article>
        <article><span><Waves size={20} /></span><div><small>UNDERSTAND</small><h3>Historical comparison</h3><p>Every reading is compared with the 1997–2009 seasonal baseline.</p></div></article>
        <article><span><Landmark size={20} /></span><div><small>ACT</small><h3>Policy and local decisions</h3><p>Authorities see priority zones while communities receive timely guidance.</p></div></article>
      </section>

      <section className="source-card">
        <BookOpen size={20} />
        <div><span className="eyebrow">DATA TRANSPARENCY</span><h3>Sources and methods</h3><p>Prototype figures reflect the supplied project brief. A production app would link each claim to its full source and update date.</p></div>
      </section>
      <button className="secondary-button" onClick={() => onNavigate('map')} type="button"><Fish size={17} /> Explore current evidence</button>
    </div>
  );
}
