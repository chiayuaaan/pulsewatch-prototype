import { useState } from 'react';
import { AlertTriangle, ArrowRight, Clock3, ShieldCheck, Sprout } from 'lucide-react';
import ForecastGraph from '../components/charts/ForecastGraph';

export default function ForecastPage({ onNavigate }) {
  const [range, setRange] = useState('season');
  return (
    <div className="page forecast-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PULSE OUTLOOK</span>
          <h1>Prepare before<br />the water changes.</h1>
        </div>
      </div>
      <div className="forecast-summary">
        <div>
          <span>Expected peak</span>
          <strong>5.1 m</strong>
          <em>Late October</em>
        </div>
        <span className="forecast-risk"><AlertTriangle size={17} /> BELOW NORMAL</span>
      </div>
      <section className="data-card forecast-card">
        <div className="range-tabs">
          {[
            ['week', '7 days'],
            ['month', '30 days'],
            ['season', '3 months'],
          ].map(([id, label]) => (
            <button key={id} className={range === id ? 'active' : ''} onClick={() => setRange(id)} type="button">{label}</button>
          ))}
        </div>
        <ForecastGraph range={range} />
        <div className="forecast-labels"><span>SEP</span><span>OCT</span><span>NOV</span></div>
        <div className="chart-legend">
          <span><i className="legend-line forecast" /> PulseWatch forecast</span>
          <span><i className="legend-line expected" /> Seasonal average</span>
        </div>
      </section>
      <section className="confidence-card">
        <div className="confidence-top">
          <span><ShieldCheck size={18} /> Forecast confidence</span>
          <strong>78%</strong>
        </div>
        <div className="confidence-track"><i /></div>
        <p>Based on 10 active gauges, recent rainfall and historical flood-pulse patterns.</p>
      </section>
      <section className="timeline-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">WHAT TO DO NEXT</span><h2>Your preparation timeline</h2></div>
        </div>
        <article className="timeline-item current">
          <div className="timeline-marker"><Clock3 size={17} /></div>
          <div><span>THIS WEEK</span><h3>Monitor low fields</h3><p>Hold planting in areas that have not reached ankle depth.</p></div>
        </article>
        <article className="timeline-item">
          <div className="timeline-marker"><Sprout size={17} /></div>
          <div><span>NEXT 2–4 WEEKS</span><h3>Prepare a dry-season option</h3><p>Set aside seed suitable for a shorter, drier cycle.</p></div>
        </article>
      </section>
      <button className="primary-button" onClick={() => onNavigate('alerts')} type="button">View local action guide <ArrowRight size={18} /></button>
    </div>
  );
}
