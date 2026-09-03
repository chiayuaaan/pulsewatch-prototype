import { useState } from 'react';
import { AlertTriangle, ArrowRight, Fish, Radio } from 'lucide-react';
import LakeMap from '../components/LakeMap';
import { stations } from '../data/mockData';

export default function MapPage({ onNavigate }) {
  const [selected, setSelected] = useState(stations[0]);
  const onlineStations = stations.filter((station) => station.online).length;

  return (
    <div className="page map-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SENSOR NETWORK</span>
          <h1>See the pulse<br />across the lake.</h1>
        </div>
        <span className="live-pill"><i /> {onlineStations} ONLINE · {stations.length} TOTAL</span>
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
      <section className="station-directory" aria-labelledby="station-directory-title">
        <div className="station-directory-heading">
          <div>
            <span className="eyebrow">ALL LOCATIONS</span>
            <h2 id="station-directory-title">15 sensor stations</h2>
          </div>
          <span>Tap a station to locate it</span>
        </div>
        <div className="station-directory-list">
          {stations.map((station, index) => (
            <button
              className={selected.id === station.id ? 'station-directory-item selected' : 'station-directory-item'}
              key={station.id}
              onClick={() => setSelected(station)}
              type="button"
            >
              <span className={`station-number ${station.tone}`}>{index + 1}</span>
              <span><strong>{station.name}</strong><small>{station.code} · {station.lastSeen}</small></span>
              <span className={`status-dot-label ${station.tone}`}><i />{station.status}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
