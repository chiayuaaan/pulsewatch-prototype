import { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  CircleCheck,
  LocateFixed,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { reportCategories } from '../data/mockData';

export default function ReportPage({ onNavigate }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [locationAttached, setLocationAttached] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="page report-success-page">
        <div className="success-orb"><CircleCheck size={38} /></div>
        <span className="eyebrow">REPORT RECEIVED</span>
        <h1>Thank you for watching the pulse.</h1>
        <p>Your prototype report has been queued for community verification. It will not appear publicly until reviewed.</p>
        <div className="report-reference"><span>Reference</span><strong>PW-2026-0901-042</strong></div>
        <button className="primary-button" onClick={() => onNavigate('pulse')} type="button">Return to Pulse</button>
        <button className="text-button success-text-button" onClick={() => { setSubmitted(false); setCategory(''); setDescription(''); }} type="button">Create another report</button>
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
          <button className={photoAttached ? 'evidence-button attached' : 'evidence-button'} onClick={() => setPhotoAttached(!photoAttached)} type="button">
            {photoAttached ? <CircleCheck size={21} /> : <Camera size={21} />}
            <span><strong>{photoAttached ? 'Photo attached' : 'Add a photo'}</strong><small>Prototype placeholder</small></span>
          </button>
          <button className={locationAttached ? 'evidence-button attached' : 'evidence-button'} onClick={() => setLocationAttached(!locationAttached)} type="button">
            {locationAttached ? <CircleCheck size={21} /> : <LocateFixed size={21} />}
            <span><strong>{locationAttached ? 'Location added' : 'Add location'}</strong><small>Kampong Phluk</small></span>
          </button>
        </div>

        <section className="privacy-note"><ShieldCheck size={17} /><p>Your name and precise location will not be shown on the public map.</p></section>
        <button className="primary-button report-submit" disabled={!category} type="submit">Submit prototype report <Send size={17} /></button>
      </form>
    </div>
  );
}
