import { ExternalLink, Navigation } from 'lucide-react';
import { stations } from '../data/mockData';

export default function LakeMap({ selected, onSelect }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`;
  const mapCenter = { lat: 12.85, lng: 104.05 };
  const pixelsPerLongitudeDegree = 182;
  const pixelsPerLatitudeDegree = 187;

  return (
    <div className="lake-map google-sensor-map">
      <iframe
        className="google-map-frame"
        title="Google Maps view of the Tonle Sap sensor network"
        src="https://maps.google.com/maps?ll=12.85%2C104.05&t=k&z=8&ie=UTF8&iwloc=&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="google-map-shade" aria-hidden="true" />
      <span className="sensor-count-badge">15 sensors</span>
      {stations.map((station, index) => (
        <button
          key={station.id}
          className={`map-pin ${station.tone} ${selected.id === station.id ? 'selected' : ''}`}
          style={{
            left: `calc(50% + ${(station.lng - mapCenter.lng) * pixelsPerLongitudeDegree}px)`,
            top: `calc(50% - ${(station.lat - mapCenter.lat) * pixelsPerLatitudeDegree}px)`,
          }}
          onClick={() => onSelect(station)}
          aria-label={`${station.name}: ${station.status}`}
          title={`${station.name} · ${station.status}`}
          type="button"
        >
          <span>{index + 1}</span>
        </button>
      ))}
      <a className="locate-button" href={googleMapsUrl} target="_blank" rel="noreferrer" aria-label={`Open ${selected.name} in Google Maps`}>
        <Navigation size={18} /><ExternalLink size={11} />
      </a>
      <div className="map-key">
        <span><i className="green" /> On schedule</span>
        <span><i className="amber" /> Weak</span>
        <span><i className="red" /> Critical / offline</span>
      </div>
    </div>
  );
}
