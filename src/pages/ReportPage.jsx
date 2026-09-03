import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  CircleCheck,
  LocateFixed,
  LoaderCircle,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { reportCategories } from '../data/mockData';

export default function ReportPage({ onNavigate }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [locationError, setLocationError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const photoInputRef = useRef(null);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const addLocation = () => {
    if (location) {
      setLocation(null);
      setLocationStatus('idle');
      setLocationError('');
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Location is not supported on this device.');
      return;
    }

    setLocationStatus('loading');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
        });
        setLocationStatus('success');
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setLocationStatus('error');
        setLocationError(denied ? 'Location permission was not allowed. Enable it and try again.' : 'We could not find your location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  const resetReport = () => {
    removePhoto();
    setSubmitted(false);
    setCategory('');
    setDescription('');
    setLocation(null);
    setLocationStatus('idle');
    setLocationError('');
  };

  if (submitted) {
    return (
      <div className="page report-success-page">
        <div className="success-orb"><CircleCheck size={38} /></div>
        <span className="eyebrow">REPORT RECEIVED</span>
        <h1>Thank you for watching the pulse.</h1>
        <p>Your prototype report has been queued for community verification. It will not appear publicly until reviewed.</p>
        <div className="report-reference"><span>Reference</span><strong>PW-2026-0901-042</strong></div>
        <button className="primary-button" onClick={() => onNavigate('pulse')} type="button">Return to Pulse</button>
        <button className="text-button success-text-button" onClick={resetReport} type="button">Create another report</button>
      </div>
    );
  }

  return (
    <div className="page report-page">
      <button className="back-button" onClick={() => onNavigate('more')} type="button"><ArrowLeft size={17} /> Back to explore</button>
      <div className="section-heading">
        <div><span className="eyebrow">COMMUNITY EVIDENCE</span><h1>Report what<br />you observe.</h1></div>
      </div>
      <p className="page-intro">Your observation can help verify sensor readings and identify local problems earlier.</p>

      <form onSubmit={(event) => { event.preventDefault(); if (category) setSubmitted(true); }}>
        <fieldset className="report-fieldset">
          <legend>1. What did you observe?</legend>
          <div className="category-grid">
            {reportCategories.map((item) => {
              const Icon = item.icon;
              const selected = category === item.id;
              return (
                <button className={selected ? `category-button ${item.tone} selected` : `category-button ${item.tone}`} key={item.id} onClick={() => setCategory(item.id)} type="button">
                  <span><Icon size={19} /></span>
                  <strong>{item.label}</strong>
                  {selected && <Check className="category-check" size={15} />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="report-label" htmlFor="report-description">2. Add a short description <span>Optional</span></label>
        <textarea id="report-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What happened? When did you first notice it?" maxLength={240} />
        <span className="character-count">{description.length}/240</span>

        <div className="evidence-buttons">
          <input
            className="report-file-input"
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            aria-label="Choose a photo from your library"
          />
          <button className={photo ? 'evidence-button attached' : 'evidence-button'} onClick={() => photoInputRef.current?.click()} type="button">
            {photo ? <CircleCheck size={21} /> : <Camera size={21} />}
            <span><strong>{photo ? 'Change photo' : 'Add a photo'}</strong><small>{photo ? photo.name : 'Choose from your library'}</small></span>
          </button>
          <button className={location ? 'evidence-button attached' : 'evidence-button'} onClick={addLocation} disabled={locationStatus === 'loading'} type="button">
            {locationStatus === 'loading' ? <LoaderCircle className="spin" size={21} /> : location ? <CircleCheck size={21} /> : <LocateFixed size={21} />}
            <span>
              <strong>{locationStatus === 'loading' ? 'Finding location…' : location ? 'Location added' : 'Add my location'}</strong>
              <small>{location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Uses your phone location'}</small>
            </span>
          </button>
        </div>

        {photo && (
          <figure className="report-photo-preview">
            <img src={photoPreview} alt="Selected report evidence" />
            <figcaption><span><strong>Photo ready</strong><small>{photo.name}</small></span><button onClick={removePhoto} type="button"><X size={16} /> Remove</button></figcaption>
          </figure>
        )}

        {location && (
          <section className="report-location-preview" aria-live="polite">
            <LocateFixed size={18} />
            <div><strong>Current location added</strong><span>{location.lat.toFixed(5)}, {location.lng.toFixed(5)} · accurate to about {location.accuracy} m</span></div>
          </section>
        )}
        {locationStatus === 'error' && <p className="report-location-error" role="alert">{locationError}</p>}

        <section className="privacy-note"><ShieldCheck size={17} /><p>Your name and precise location will not be shown on the public map.</p></section>
        <button className="primary-button report-submit" disabled={!category} type="submit">Submit prototype report <Send size={17} /></button>
      </form>
    </div>
  );
}
