import { Navigation, Radio } from 'lucide-react';
import { stations } from '../data/mockData';

export default function LakeMap({ selected, onSelect }) {
  return (
    <div className="lake-map">
      <div className="map-noise" />
      <svg className="lake-shape" viewBox="0 0 340 470" aria-hidden="true">
        <path d="M184 18c38 23 45 72 74 111 26 35 59 62 50 102-9 41-60 50-79 87-19 38-10 96-53 124-39 25-82-5-103-43-20-36 6-80-4-119-12-43-55-71-37-118 17-44 69-49 93-84 19-27 24-80 59-60Z" />
        <path className="river" d="M185 15c-7 45-25 70-4 111 19 38 59 54 45 100" />
      </svg>
      <span className="map-label lake-label">TONLE SAP</span>
      <span className="map-label siem-label">SIEM REAP</span>
      <span className="map-label south-label">KAMPONG CHHNANG</span>
      {stations.map((station) => (
        <button
          key={station.id}
          className={`map-pin ${station.tone} ${selected.id === station.id ? 'selected' : ''}`}
          style={{ left: `${station.x}%`, top: `${station.y}%` }}
          onClick={() => onSelect(station)}
          aria-label={`${station.name}: ${station.status}`}
          type="button"
        >
          <span><Radio size={15} /></span>
        </button>
      ))}
      <button className="locate-button" type="button" aria-label="Find my location"><Navigation size={19} /></button>
      <div className="map-key">
        <span><i className="green" /> On schedule</span>
        <span><i className="amber" /> Weak</span>
        <span><i className="red" /> Critical</span>
      </div>
    </div>
  );
}
