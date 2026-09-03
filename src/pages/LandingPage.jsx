import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Languages, Menu, Volume2, VolumeX, X } from 'lucide-react';

const methodSteps = [
  {
    number: '01',
    title: 'Capture the pulse',
    copy: 'Solar-powered community gauges read the lake every 15 minutes, then send water-level data through the cellular network.',
    label: 'KAMPONG PHLUK · GAUGE 04',
  },
  {
    number: '02',
    title: 'Detect the change',
    copy: 'SAP Analytics Cloud compares live readings with the 1997–2009 baseline and forecasts pulse strength one to three months ahead.',
    label: 'CURRENT LEVEL · 35% BELOW EXPECTED',
  },
  {
    number: '03',
    title: 'Visualise the action',
    copy: 'Communities receive a simple next step while authorities see priority zones, trends, raw evidence, and refuge locations.',
    label: 'ACTION SIGNAL · WEAK PULSE',
  },
];

const networkLabels = [
  'KAMPONG LUONG',
  'KAMPONG PHLUK',
  'PREK TOAL',
  'KAMPONG CHHNANG',
  'TONLE SAP RIVER',
];

const evidenceRows = [
  ['Community gauges', 'Water level every 15 minutes'],
  ['Historical baseline', '1997–2009 seasonal pattern'],
  ['Forecast intelligence', 'One to three months ahead'],
  ['Adaptive refuges', 'Placed before weak inundation'],
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function LandingPage({ language = 'en', onToggleLanguage, onNavigate }) {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const darkRef = useRef(null);
  const methodRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = document.querySelector('.landing-content');
    if (!root || !scroller) return undefined;

    let frame = 0;
    let currentStep = 0;

    const progressFor = (element) => {
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, rect.height - scroller.clientHeight);
      return clamp(-rect.top / distance);
    };

    const update = () => {
      frame = 0;
      const hero = progressFor(heroRef.current);
      const dark = progressFor(darkRef.current);
      const method = progressFor(methodRef.current);
      const darkRect = darkRef.current.getBoundingClientRect();
      const darkVisible = darkRect.top < scroller.clientHeight * 0.6 && darkRect.bottom > scroller.clientHeight * 0.2;
      const showNav = hero > 0.48 || heroRef.current.getBoundingClientRect().bottom < scroller.clientHeight * 0.8;

      root.classList.toggle('dark-nav', darkVisible);

      root.style.setProperty('--hero-scale', String(1 + hero * 0.32));
      root.style.setProperty('--hero-x', `${hero * -4}vw`);
      root.style.setProperty('--hero-y', `${hero * -7}vh`);
      root.style.setProperty('--hero-copy-opacity', String(clamp(1 - hero * 3.6)));
      root.style.setProperty('--hero-copy-y', `${hero * -18}vh`);
      root.style.setProperty('--hero-story-opacity', String(clamp((hero - 0.3) * 4) * clamp((0.98 - hero) * 5)));
      root.style.setProperty('--hero-story-y', `${(0.56 - hero) * 18}vh`);
      root.style.setProperty('--nav-opacity', showNav ? '1' : '0');
      root.style.setProperty('--dark-turn', `${dark * 220}deg`);
      root.style.setProperty('--dark-counter-turn', `${dark * -220}deg`);
      root.style.setProperty('--dark-scale', String(0.72 + dark * 0.72));
      root.style.setProperty('--dark-card-y', `${(0.5 - dark) * 28}vh`);
      const darkCopy = clamp((dark - 0.45) * 4);
      root.style.setProperty('--dark-copy-opacity', String(darkCopy));
      root.style.setProperty('--dark-copy-y', `${(1 - darkCopy) * 24}px`);
      root.style.setProperty('--method-drift', `${method * -34}vh`);
      root.style.setProperty('--method-rotate', `${method * 32}deg`);

      const nextStep = Math.min(2, Math.floor(clamp(method * 0.999) * 3));
      if (nextStep !== currentStep) {
        currentStep = nextStep;
        setActiveStep(nextStep);
      }
    };

    const queueUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scroller.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    update();

    return () => {
      scroller.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' });
    setMenuOpen(false);
  };

  return (
    <div className={`pw-film ${motionOn ? '' : 'motion-paused'}`} ref={rootRef}>
      <header className="film-nav">
        <button className="film-wordmark" type="button" onClick={() => scrollTo('pulsewatch-top')}>PulseWatch</button>
        <nav className={menuOpen ? 'open' : ''} aria-label="Landing page navigation">
          <button type="button" onClick={() => scrollTo('what-we-do')}>WHAT WE DO</button>
          <button type="button" onClick={() => scrollTo('impact')}>IMPACT</button>
          <button type="button" onClick={() => scrollTo('method')}>METHOD</button>
          <button type="button" onClick={() => onNavigate('onboarding')}>ENTER APP <ArrowRight size={12} /></button>
        </nav>
        <button
          className="film-menu"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <main>
        <section className="film-hero-track" id="pulsewatch-top" ref={heroRef}>
          <div className="film-sticky film-hero-frame">
            <img className="film-landscape" src="/tonle-sap-landscape.png" alt="Illustrated Tonle Sap flooded forest and floating community" />
            <div className="film-hero-copy">
              <span className="film-overline">PulseWatch</span>
              <h1>Shared intelligence<br />for the Tonle Sap<br />flood pulse</h1>
              <button type="button" onClick={() => scrollTo('what-we-do')}>DISCOVER PULSEWATCH <ArrowRight size={11} /></button>
            </div>

            <div className="film-hero-story">
              <span className="film-coordinate">12.8337° N · 104.0659° E</span>
              <h2>The lake’s rhythm<br />is changing.</h2>
              <p>We make that change visible—while there is still time to act.</p>
              <div className="film-story-signal"><i /><i /><i /><i /><i /><i /><i /></div>
            </div>

            <span className="film-scroll-index">SCROLL<br />TO FOLLOW<br />THE PULSE</span>
          </div>
        </section>

        <section className="film-about" id="what-we-do">
          <img src="/tonle-sap-aerial.png" alt="Aerial botanical study of the Tonle Sap floodplain" />
          <div className="film-about-copy">
            <p>
              We are a community intelligence platform, focused on turning live water-level data into
              <span> public evidence, early warning and ecological action.</span>
            </p>
          </div>
          <aside className="film-map-note note-one"><strong>−29.4%</strong><span>REVERSE FLOW<br />SINCE 2018</span></aside>
          <aside className="film-map-note note-two"><strong>1.7M+</strong><span>PEOPLE DEPEND<br />ON THE LAKE</span></aside>
          <aside className="film-map-note note-three"><strong>−48%</strong><span>FISH CATCH<br />2018–2022</span></aside>
        </section>

        <section className="film-dark-track" id="impact" ref={darkRef}>
          <div className="film-sticky film-dark-frame">
            <div className="signal-orbit">
              {Array.from({ length: 20 }, (_, index) => (
                <i key={index} style={{ '--dot-angle': `${index * 18}deg` }} />
              ))}
              <div className="signal-ring ring-outer" />
              <div className="signal-ring ring-inner" />
              <article className="signal-card">
                <div className="signal-bars">
                  {Array.from({ length: 30 }, (_, index) => <i key={index} />)}
                </div>
                <strong>−35% FROM EXPECTED</strong>
                <span>KAMPONG PHLUK · WEAK PULSE · 08:23</span>
              </article>
            </div>
            <div className="dark-section-copy">
              <small>THE SIGNAL BENEATH THE SURFACE</small>
              <h2>See the pulse.<br />Predict the change.</h2>
            </div>
          </div>
        </section>

        <section className="film-method-track" id="method" ref={methodRef}>
          <div className="film-sticky film-method-frame">
            <div className="method-rail" aria-hidden="true">
              {methodSteps.map((step, index) => (
                <span className={index === activeStep ? 'active' : ''} key={step.number}>{step.number}<i /></span>
              ))}
            </div>

            <div className="method-copy-stack">
              {methodSteps.map((step, index) => (
                <article className={index === activeStep ? 'active' : ''} key={step.number}>
                  <span>{step.number}</span>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                  {index === 2 && (
                    <button type="button" onClick={() => onNavigate('onboarding')}>GO TO LIVE VIEW <ArrowRight size={12} /></button>
                  )}
                </article>
              ))}
            </div>

            <div className={`method-visual visual-step-${activeStep + 1}`}>
              <div className="method-lake-outline"><i /><i /><i /></div>
              <div className="method-signal-lines">
                {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
              </div>
              <div className="method-data-points">
                {networkLabels.map((label, index) => (
                  <span key={label} style={{ '--point-index': index }}>
                    <i />
                    <em>{label}<br />{methodSteps[activeStep].label}</em>
                  </span>
                ))}
              </div>
            </div>

            <span className="method-section-label">PULSEWATCH METHOD</span>
          </div>
        </section>

        <section className="film-network">
          <h2>The people and organisations<br />the pulse connects.</h2>
          <div className="network-name-row">
            <span>LAKE<br />COMMUNITIES</span>
            <i />
            <span>MRC</span>
            <i />
            <span>SAP</span>
            <i />
            <span>NGOs</span>
            <i />
            <span>RESEARCHERS</span>
          </div>
          <p>
            PulseWatch creates one trusted evidence layer for residents, fishers, farmers,
            ministries, NGOs and researchers—so warnings and policy begin with the same signal.
          </p>
        </section>

        <section className="film-evidence">
          <div className="film-evidence-intro">
            <small>THE EVIDENCE ENGINE</small>
            <h2>Data becomes<br />shared action.</h2>
          </div>
          <div className="evidence-accordion">
            {evidenceRows.map(([title, detail], index) => (
              <details key={title} open={index === 0}>
                <summary><span>{title}</span><small>{detail}</small><i>+</i></summary>
                <p>{index === 0
                  ? 'Local gauges combine precise readings with pole lights, Khmer voice messages and cellular transmission.'
                  : 'Each layer turns a complex flood-pulse signal into evidence that can be understood, checked and acted on.'}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="film-contact">
          <div className="contact-dots" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => (
              <i
                key={index}
                style={{
                  '--contact-left': `${7 + (index % 8) * 12}%`,
                  '--contact-top': `${20 + (index % 4) * 19}%`,
                  '--contact-delay': `${index * -0.17}s`,
                }}
              />
            ))}
          </div>
          <h2>See the pulse<br />with us</h2>
          <button type="button" onClick={() => onNavigate('onboarding')}>ENTER THE PROTOTYPE <ArrowRight size={11} /></button>
        </section>
      </main>

      <footer className="film-footer">
        <strong>PulseWatch</strong>
        <div>
          <span>TONLE SAP, CAMBODIA</span>
          <span>OPEN FLOOD-PULSE EVIDENCE</span>
          <span>COMMUNITY ACTION</span>
          <button className="film-admin-access" type="button" onClick={() => onNavigate('admin-login')}>
            AUTHORITY ACCESS <ArrowRight size={11} />
          </button>
        </div>
        <p>See the pulse. Predict the change.<br />Protect what depends on it.</p>
      </footer>

      <button className="film-language-toggle" data-no-translate type="button" onClick={onToggleLanguage} aria-label={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}>
        <Languages size={14} /> {language === 'en' ? 'ខ្មែរ' : 'English'}
      </button>
      <button className="film-motion-toggle" type="button" onClick={() => setMotionOn((value) => !value)}>
        {motionOn ? <Volume2 size={11} /> : <VolumeX size={11} />}
        MOTION {motionOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
