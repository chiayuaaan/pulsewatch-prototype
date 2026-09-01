import { useState } from 'react';
import { AlertTriangle, ArrowRight, Fish, Radio } from 'lucide-react';
import LakeMap from '../components/LakeMap';
import { stations } from '../data/mockData';

export default function MapPage({ onNavigate }) {
  const [selected, setSelected] = useState(stations[0]);

  return (
    <div className="page map-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SENSOR NETWORK</span>
          <h1>See the pulse<br />across the lake.</h1>
        </div>
        <span className="live-pill"><i /> 10 ONLINE</span>
      </div>
      <div className="filter-row">
        <button className="filter-pill active" type="button">All stations</button>
        <button className="filter-pill" onClick={() => onNavigate('refuges')} type="button"><Fish size={15} /> Refuges</button>
        <button className="filter-pill" onClick={() => onNavigate('alerts')} type="button"><AlertTriangle size={15} /> Risks</button>
      </div>
      <LakeMap selected={selected} onSelect={setSelected} />
      <section className="selected-station" key={selected.id}>
        <div className={`station-status-mark ${selected.tone}`}><Radio size={20} /></div>
        <div className="station-detail-copy">
          <div className="station-title-row">
            <div>
              <span className="eyebrow">SELECTED STATION</span>
              <h2>{selected.name}</h2>
            </div>
            <span className={`status-dot-label ${selected.tone}`}><i />{selected.status}</span>
          </div>
          <div className="station-metrics">
            <div><span>Level</span><strong>{selected.level}</strong></div>
            <div><span>Deviation</span><strong>{selected.delta}</strong></div>
            <div><span>Updated</span><strong>{selected.lastSeen}</strong></div>
          </div>
          <button className="station-detail-link" onClick={() => onNavigate('station', { stationId: selected.id })} type="button">
            Open full station view <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
