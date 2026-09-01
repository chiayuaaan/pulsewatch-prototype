import { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  CircleCheck,
  Fish,
  Gauge,
  Sprout,
  Volume2,
} from 'lucide-react';
import { alertHistory } from '../data/mockData';

export default function AlertsPage() {
  const [scope, setScope] = useState('near');
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="page alerts-page">
      <div className="section-heading">
        <div><span className="eyebrow">COMMUNITY GUIDANCE</span><h1>Know what changed.<br />Know what to do.</h1></div>
      </div>
      <div className="scope-toggle">
        <button className={scope === 'near' ? 'active' : ''} onClick={() => setScope('near')} type="button">Near me <span>1</span></button>
        <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')} type="button">All lake <span>4</span></button>
      </div>
      <section className="active-alert">
        <div className="alert-topline">
          <span className="status-pill amber"><AlertTriangle size={14} /> ACTIVE ADVISORY</span>
          <span>30 Aug · 16:20</span>
        </div>
        <h2>Weak pulse may delay planting conditions.</h2>
        <p>Water near Kampong Phluk is rising 35% slower than the seasonal average.</p>
        <div className="alert-evidence">
          <Gauge size={18} />
          <div><span>Verified by 3 nearby gauges</span><strong>Latest reading: 4.2 m</strong></div>
          <CircleCheck size={18} />
        </div>
        <button className="advice-toggle" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? 'Hide action guide' : 'Show action guide'} <ChevronRight className={expanded ? 'rotated' : ''} size={18} />
        </button>
        {expanded && (
          <div className="advice-panel">
            <article><span><Sprout size={19} /></span><div><strong>For farmers</strong><p>Delay low-field planting for 7 days and check the next update.</p></div></article>
            <article><span><Fish size={19} /></span><div><strong>For fishers</strong><p>Avoid shallow channels where oxygen may fall overnight.</p></div></article>
            <button className="audio-button" type="button"><Volume2 size={18} /> Play guidance in Khmer</button>
          </div>
        )}
      </section>
      <div className="section-heading compact history-heading">
        <div><span className="eyebrow">RECENT UPDATES</span><h2>Earlier alerts</h2></div>
      </div>
      <section className="alert-list">
        {alertHistory.map((item) => {
          const Icon = item.icon;
          return (
            <button className="history-alert" key={item.title} type="button">
              <span className={`history-icon ${item.tone}`}><Icon size={19} /></span>
              <span className="history-copy"><small>{item.date}</small><strong>{item.title}</strong><em>{item.area}</em></span>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </section>
    </div>
  );
}
