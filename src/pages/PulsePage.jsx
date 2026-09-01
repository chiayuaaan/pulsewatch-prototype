import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Droplets,
  Info,
  MapPin,
  Radio,
  Sprout,
  Wifi,
} from 'lucide-react';
import PulseLineChart from '../components/charts/PulseLineChart';

export default function PulsePage({ onNavigate }) {
  return (
    <div className="page pulse-page">
      <section className="location-row">
        <div>
          <span className="eyebrow">YOUR AREA</span>
          <strong><MapPin size={15} /> Kampong Phluk</strong>
        </div>
        <span className="live-pill"><i /> LIVE</span>
      </section>

      <section className="pulse-hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <span className="status-pill amber"><AlertTriangle size={14} /> WEAK PULSE</span>
          <h1>The lake is rising<br />too slowly.</h1>
          <p>Today’s water level is below the seasonal pattern for this area.</p>
        </div>
        <div className="pulse-score">
          <span className="score-value">−35%</span>
          <span>from expected</span>
        </div>
        <button className="hero-link" onClick={() => onNavigate('forecast')} type="button">
          See the 3-month outlook <ArrowRight size={17} />
        </button>
      </section>

      <section className="action-card">
        <div className="action-icon"><Sprout size={23} /></div>
        <div className="action-copy">
          <span className="eyebrow">RECOMMENDED THIS WEEK</span>
          <h2>Delay flood-recession planting.</h2>
          <p>Wait for the next forecast update before preparing low fields.</p>
        </div>
        <button className="round-button" onClick={() => onNavigate('alerts')} aria-label="View recommended action" type="button">
          <ChevronRight size={20} />
        </button>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-icon blue"><Droplets size={18} /></div>
          <span>Water level</span>
          <strong>4.2 <small>m</small></strong>
          <em className="down">−0.3 m this week</em>
        </article>
        <article className="metric-card">
          <div className="metric-icon green"><Wifi size={18} /></div>
          <span>Nearest gauge</span>
          <strong>2.4 <small>km</small></strong>
          <em>Updated 2 min ago</em>
        </article>
      </section>

      <section className="data-card trend-card">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">SEASONAL RISE</span>
            <h2>Current vs expected</h2>
          </div>
          <button className="text-button" onClick={() => onNavigate('forecast')} type="button">Details</button>
        </div>
        <PulseLineChart />
        <div className="chart-legend">
          <span><i className="legend-line actual" /> Current</span>
          <span><i className="legend-line expected" /> 1997–2009 average</span>
        </div>
      </section>

      <button className="station-summary" onClick={() => onNavigate('map')} type="button">
        <span className="station-icon"><Radio size={20} /></span>
        <span>
          <small>10 of 12 stations online</small>
          <strong>View the monitoring network</strong>
        </span>
        <ChevronRight size={19} />
      </button>

      <p className="demo-note"><Info size={13} /> Prototype data for demonstration</p>
    </div>
  );
}
