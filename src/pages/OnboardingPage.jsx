import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Languages,
  MapPinned,
  Sprout,
  Volume2,
  Waves,
} from 'lucide-react';
import BrandMark from '../components/BrandMark';

const slides = {
  en: [
    {
      icon: Waves,
      image: '/guide-home-sharp.jpg',
      fallback: '/tonle-sap-landscape.png',
      alt: 'PulseWatch Home page showing today’s water condition',
      label: 'Home page',
      title: 'See today’s water condition.',
      body: 'Know whether the lake is rising normally, slowly or at a dangerous level.',
    },
    {
      icon: MapPinned,
      image: '/guide-map-sharp.jpg',
      fallback: '/tonle-sap-landscape.png',
      alt: 'PulseWatch Map page showing nearby water gauges',
      label: 'Map page',
      title: 'Check your village and nearby gauges.',
      body: 'PulseWatch uses your selected area to show the most useful warning first.',
    },
    {
      icon: Sprout,
      image: '/guide-alerts-sharp.jpg',
      fallback: '/tonle-sap-aerial.png',
      alt: 'PulseWatch Alerts page showing community guidance',
      label: 'Alerts page',
      title: 'Know what you should do next.',
      body: 'Read the advice in English or hear important guidance spoken in Khmer.',
    },
  ],
  kh: [
    {
      icon: Waves,
      image: '/guide-home.png',
      fallback: '/tonle-sap-landscape.png',
      alt: 'ទំព័រដើម PulseWatch បង្ហាញស្ថានភាពទឹកថ្ងៃនេះ',
      label: 'ទំព័រដើម',
      title: 'មើលស្ថានភាពទឹកថ្ងៃនេះ។',
      body: 'ដឹងថាទឹកបឹងកំពុងឡើងធម្មតា ឡើងយឺត ឬស្ថិតនៅកម្រិតគ្រោះថ្នាក់។',
    },
    {
      icon: MapPinned,
      image: '/guide-map.png',
      fallback: '/tonle-sap-landscape.png',
      alt: 'ទំព័រផែនទី PulseWatch បង្ហាញឧបករណ៍វាស់ទឹកនៅក្បែរ',
      label: 'ទំព័រផែនទី',
      title: 'ពិនិត្យភូមិ និងឧបករណ៍វាស់ទឹកនៅជិតអ្នក។',
      body: 'PulseWatch ប្រើតំបន់ដែលអ្នកជ្រើស ដើម្បីបង្ហាញការជូនដំណឹងសំខាន់ជាងគេមុន។',
    },
    {
      icon: Sprout,
      image: '/guide-alerts.png',
      fallback: '/tonle-sap-aerial.png',
      alt: 'ទំព័រជូនដំណឹង PulseWatch បង្ហាញការណែនាំសហគមន៍',
      label: 'ទំព័រជូនដំណឹង',
      title: 'ដឹងថាអ្នកគួរធ្វើអ្វីបន្ទាប់។',
      body: 'អានការណែនាំជាភាសាអង់គ្លេស ឬស្តាប់សេចក្ដីណែនាំសំខាន់ជាភាសាខ្មែរ។',
    },
  ],
};

const interfaceCopy = {
  en: {
    progress: 'Introduction',
    backToStory: 'Back to story',
    back: 'Back',
    skip: 'Skip introduction',
    next: 'Next',
    start: 'Open PulseWatch',
    language: 'Switch to Khmer',
    audio: 'Khmer audio is available for important guidance',
  },
  kh: {
    progress: 'សេចក្ដីណែនាំ',
    backToStory: 'ត្រឡប់ទៅរឿងរ៉ាវ',
    back: 'ថយក្រោយ',
    skip: 'រំលងសេចក្ដីណែនាំ',
    next: 'បន្ទាប់',
    start: 'បើក PulseWatch',
    language: 'ប្ដូរទៅភាសាអង់គ្លេស',
    audio: 'មានសំឡេងជាភាសាខ្មែរសម្រាប់សេចក្ដីណែនាំសំខាន់ៗ',
  },
};

export default function OnboardingPage({ language = 'en', activeLanguage = 'en', onToggleLanguage, onNavigate }) {
  const [step, setStep] = useState(0);
  const t = interfaceCopy[language] ?? interfaceCopy.en;
  const items = slides[language] ?? slides.en;
  const slide = items[step];
  const Icon = slide.icon;
  const finalStep = step === items.length - 1;

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <button className="onboarding-brand" onClick={() => onNavigate('landing')} type="button">
          <BrandMark />
          <span><strong>PulseWatch</strong><small>{t.progress}</small></span>
        </button>
        <button className="onboarding-language" data-no-translate onClick={onToggleLanguage} type="button" aria-label={activeLanguage === 'en' ? 'Switch to Khmer' : 'Switch to English'}>
          <Languages size={18} /> {activeLanguage === 'en' ? 'ខ្មែរ' : 'English'}
        </button>
      </header>

      <main className="onboarding-stage" aria-live="polite">
        <div
          className="onboarding-progress"
          role="progressbar"
          aria-label={`${step + 1} of ${items.length}`}
          aria-valuemin="1"
          aria-valuemax={items.length}
          aria-valuenow={step + 1}
        >
          {items.map((item, index) => (
            <span className={index < step ? 'complete' : index === step ? 'current' : ''} key={index}><i /></span>
          ))}
        </div>

        <figure className="onboarding-image onboarding-slide" key={`visual-${step}`}>
          <img
            src={slide.image}
            alt={slide.alt}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = slide.fallback;
            }}
          />
          <span><Icon size={24} /> {slide.label}</span>
        </figure>

        <section className="onboarding-copy onboarding-slide" key={`copy-${step}`}>
          <span>{step + 1} / {items.length}</span>
          <h1>{slide.title}</h1>
          <p>{slide.body}</p>
          {finalStep && <div className="onboarding-audio-note"><Volume2 size={20} /> {t.audio}</div>}
        </section>

        <div className="onboarding-actions">
          <button className="onboarding-secondary" onClick={() => step > 0 ? setStep(step - 1) : onNavigate('landing')} type="button">
            <ArrowLeft size={18} /> {step > 0 ? t.back : t.backToStory}
          </button>
          <button className="onboarding-primary" onClick={() => finalStep ? onNavigate('pulse') : setStep(step + 1)} type="button">
            {finalStep ? t.start : t.next} <ArrowRight size={18} />
          </button>
        </div>

        {!finalStep && <button className="onboarding-skip" onClick={() => onNavigate('pulse')} type="button">{t.skip}</button>}
      </main>
    </div>
  );
}
