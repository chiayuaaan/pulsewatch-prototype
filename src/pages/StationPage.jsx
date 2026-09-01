import {
  ArrowLeft,
  BatteryCharging,
  CalendarClock,
  CircleCheck,
  Droplets,
  Radio,
  Signal,
  Wrench,
} from 'lucide-react';
import PulseLineChart from '../components/charts/PulseLineChart';
import { getStation } from '../data/mockData';

export default function StationPage({ stationId, onNavigate }) {
  const station = getStation(stationId);
  return (
    <div className="page station-page">
      <button className="back-button" onClick={() => onNavigate('map')} type="button">
        <ArrowLeft size={17} /> Back to map
      </button>

      <section className="station-hero-card">
        <div className="station-hero-top">
          <span className={`station-large-icon ${station.tone}`}><Radio size={25} /></span>
          <span className={`status-dot-label ${station.tone}`}><i /> {station.status}</span>
        </div>
        <span className="eyebrow">{station.code} · COMMUNITY GAUGE</span>
        <h1>{station.name}</h1>
        <div className="station-level-row">
          <div><span>Current water level</span><strong>{station.level}</strong></div>
          <div><span>Expected today</span><strong>{station.expected}</strong></div>
        </div>
        <div className={`station-deviation ${station.tone}`}>{station.delta}</div>
      </section>

      <section className="data-card station-chart-card">
        <div className="section-heading compact">
          <div><span className="eyebrow">LAST 30 DAYS</span><h2>Water-level trend</h2></div>
          <span className="live-pill"><i /> {station.lastSeen}</span>
        </div>
        <PulseLineChart />
        <div className="chart-legend">
          <span><i className="legend-line actual" /> Station reading</span>
          <span><i className="legend-line expected" /> Expected level</span>
        </div>
      </section>

      <section className="sensor-health-grid">
        <article>
          <BatteryCharging size={20} />
          <span>Battery</span>
          <strong>{station.battery}%</strong>
          <div className="mini-progress"><i style={{ width: `${station.battery}%` }} /></div>
        </article>
        <article>
          <Signal size={20} />
          <span>Network</span>
          <strong>{station.signal}</strong>
          <small>Cellular link</small>
        </article>
        <article>
          <Droplets size={20} />
          <span>Sensor quality</span>
          <strong>±1 cm</strong>
          <small>Calibrated</small>
        </article>
        <article>
          <CircleCheck size={20} />
          <span>Data quality</span>
          <strong>Verified</strong>
          <small>No gaps today</small>
        </article>
      </section>

      <section className="maintenance-card">
        <div className="section-heading compact">
          <div><span className="eyebrow">STATION OPERATIONS</span><h2>Maintenance record</h2></div>
        </div>
        <div className="maintenance-row"><CalendarClock size={18} /><div><span>Installed</span><strong>{station.installed}</strong></div></div>
        <div className="maintenance-row"><Wrench size={18} /><div><span>Last inspection</span><strong>24 August 2026 · No issues</strong></div></div>
      </section>

      <button className="secondary-button" onClick={() => onNavigate('report')} type="button">Report a problem with this station</button>
    </div>
  );
}
