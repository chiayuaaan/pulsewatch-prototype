import {
  ArrowRight,
  Bot,
  Database,
  FileWarning,
  Fish,
  Radio,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

const features = [
  { id: 'refuges', eyebrow: 'ADAPTATION', title: 'Adaptive fish refuges', text: 'Track habitat health and forecast-led placement.', icon: Fish, tone: 'green' },
  { id: 'report', eyebrow: 'COMMUNITY', title: 'Report an observation', text: 'Add local evidence, a photo and location.', icon: FileWarning, tone: 'amber' },
  { id: 'impact', eyebrow: 'EVIDENCE', title: 'Impact insights', text: 'Explore the decline, methodology and system value.', icon: Database, tone: 'blue' },
  { id: 'ask', eyebrow: 'GUIDANCE', title: 'Ask PulseWatch', text: 'Understand verified readings in plain language.', icon: Bot, tone: 'purple' },
];

export default function MorePage({ onNavigate }) {
  return (
    <div className="page more-page">
      <div className="section-heading">
        <div><span className="eyebrow">EXPLORE PULSEWATCH</span><h1>More ways to<br />understand and act.</h1></div>
      </div>
      <section className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button className={`feature-card ${feature.tone}`} key={feature.id} onClick={() => onNavigate(feature.id)} type="button">
              <span className="feature-icon"><Icon size={22} /></span>
              <span className="eyebrow">{feature.eyebrow}</span>
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
              <span className="feature-link">Open <ArrowRight size={14} /></span>
            </button>
          );
        })}
      </section>

      <button className="network-shortcut" onClick={() => onNavigate('map')} type="button">
        <span><Radio size={21} /></span>
        <div><small>MONITORING NETWORK</small><strong>10 of 12 stations are online</strong></div>
        <ArrowRight size={17} />
      </button>

      <section className="offline-card">
        <div className="offline-card-top"><span><RefreshCw size={17} /> Offline data</span><strong>Ready</strong></div>
        <p>Latest local status, guidance and map data are available without a connection.</p>
        <div className="offline-meta"><span>Last synced 2 min ago</span><span>4.8 MB</span></div>
      </section>

      <section className="prototype-disclosure"><ShieldCheck size={16} /><p>Advanced pages use demonstration data and simulated actions.</p></section>
    </div>
  );
}
