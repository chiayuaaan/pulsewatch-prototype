import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Droplets,
  Fish,
  Sparkles,
  ThermometerSun,
} from 'lucide-react';
import { refuges } from '../data/mockData';

export default function RefugesPage({ onNavigate }) {
  return (
    <div className="page refuges-page">
      <button className="back-button" onClick={() => onNavigate('more')} type="button"><ArrowLeft size={17} /> Back to explore</button>
      <div className="section-heading">
        <div><span className="eyebrow">ADAPTIVE HABITAT</span><h1>Protect nurseries<br />before the pulse fails.</h1></div>
      </div>

      <section className="refuge-forecast-card">
        <span className="refuge-forecast-icon"><Sparkles size={22} /></span>
        <div>
          <span className="eyebrow">PLACEMENT RECOMMENDATION</span>
          <h2>Deploy one refuge near Kampong Phluk.</h2>
          <p>The 3-month outlook predicts insufficient shallow nursery habitat in Zone 2.</p>
        </div>
        <span className="confidence-chip">78% confidence</span>
      </section>

      <div className="section-heading compact refuge-list-heading">
        <div><span className="eyebrow">LIVE REFUGE NETWORK</span><h2>3 priority locations</h2></div>
      </div>
      <section className="refuge-list">
        {refuges.map((refuge) => (
          <article className={`refuge-card ${refuge.tone}`} key={refuge.id}>
            <div className="refuge-card-top">
              <span className={`refuge-icon ${refuge.tone}`}><Fish size={21} /></span>
              <div><span className="eyebrow">{refuge.area}</span><h2>{refuge.name}</h2></div>
              <span className={`status-dot-label ${refuge.tone}`}><i /> {refuge.status}</span>
            </div>
            {refuge.oxygen ? (
              <div className="refuge-metrics">
                <div><Droplets size={16} /><span>Oxygen</span><strong>{refuge.oxygen} mg/L</strong></div>
                <div><ThermometerSun size={16} /><span>Water</span><strong>{refuge.temperature}°C</strong></div>
                <div><Fish size={16} /><span>Habitat</span><strong>{refuge.habitat}%</strong></div>
              </div>
            ) : (
              <div className="deployment-placeholder"><CalendarClock size={18} /> Awaiting deployment and sensor activation</div>
            )}
            <div className="refuge-action-row">
              <span>{refuge.updated}</span>
              <strong>{refuge.recommendation}</strong>
            </div>
          </article>
        ))}
      </section>
      <section className="prototype-disclosure"><AlertTriangle size={16} /><p>Refuge placement and habitat scores are simulated for this prototype.</p></section>
    </div>
  );
}
