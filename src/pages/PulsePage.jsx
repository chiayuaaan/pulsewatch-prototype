import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Droplets,
  Gauge,
  Info,
  MapPin,
  Radio,
  Sprout,
  Square,
  Volume2,
  Waves,
  Wifi,
} from 'lucide-react';
import PulseLineChart from '../components/charts/PulseLineChart';

const homeCopy = {
  en: {
    areaLabel: 'Your area',
    area: 'Kampong Phluk',
    changeArea: 'Check',
    updated: 'Updated 2 minutes ago',
    photoAlt: 'Floating homes and boats on Tonle Sap Lake',
    photoPlace: 'Tonle Sap · Kampong Phluk',
    photoCredit: 'Tonle Sap floating village · Photo: David Sim / CC BY 2.0',
    statusLabel: 'Weak water rise',
    status: 'Water is rising slowly',
    levelLabel: 'Water level now',
    lower: '35% below normal',
    usualToday: 'Usual today: 6.5 m',
    explanation: 'The lake is much lower than usual for this time of year. Low fields may not have enough water yet.',
    actionLabel: 'What you should do',
    actionTitle: 'Wait 7 more days before planting low fields.',
    actionBody: 'Check the next update before preparing the soil.',
    hear: 'Hear this in Khmer',
    stopAudio: 'Stop Khmer audio',
    loadingAudio: 'Loading Khmer audio…',
    audioUnavailable: 'Khmer audio is unavailable. Check your connection and try again.',
    playing: 'Playing Khmer guidance…',
    audioDisclosure: 'AI-generated Khmer voice',
    forecast: 'Full forecast',
    outlookTitle: 'Water forecast',
    outlookSummary: 'Water should continue rising, but it will remain below the normal seasonal level.',
    forecastRows: [
      { when: 'Today', state: 'Slow rise', note: 'Weak pulse', value: '4.2 m', width: '38%', tone: 'warning' },
      { when: 'Tomorrow', state: 'Still rising', note: 'Below normal', value: '4.3 m', width: '44%', tone: 'warning' },
      { when: 'In 3 days', state: 'Steady rise', note: 'Below normal', value: '4.5 m', width: '53%', tone: 'info' },
      { when: 'In 7 days', state: 'Weak pulse', note: 'Watch planting', value: '4.8 m', width: '64%', tone: 'info' },
    ],
    detailsTitle: 'Today’s readings',
    usualLevel: 'Usual water level',
    deviation: 'Difference from normal',
    nearestGauge: 'Nearest gauge',
    stationsOnline: 'Stations working',
    stationDistance: '1.2 km away',
    onlineValue: '10 of 12',
    levelTitle: 'Water level comparison',
    levelMeaning: 'Today’s level is 2.3 m below the usual seasonal level.',
    current: 'Now · 4.2 m',
    expected: 'Usual · 6.5 m',
    currentShort: 'Now',
    expectedShort: 'Usual today',
    lowerShort: 'Below normal',
    chartOpen: 'See the detailed water chart',
    chartNote: 'The current water level remains below the normal seasonal rise.',
    chartCurrent: 'Current water',
    chartExpected: 'Normal range',
    nearbyTitle: 'Nearby gauges',
    nearbyBody: 'See readings around your village',
    alertTitle: 'Active alert',
    alertBody: 'Planting may be delayed',
    demo: 'Prototype information for demonstration',
  },
  kh: {
    areaLabel: 'តំបន់របស់អ្នក',
    area: 'កំពង់ភ្លុក',
    changeArea: 'ផ្លាស់ប្តូរ',
    updated: 'បានធ្វើបច្ចុប្បន្នភាព ២ នាទីមុន',
    photoAlt: 'ផ្ទះបណ្ដែតទឹក និងទូកនៅបឹងទន្លេសាប',
    photoPlace: 'ទន្លេសាប · កំពង់ភ្លុក',
    photoCredit: 'ភូមិបណ្ដែតទឹកទន្លេសាប · រូបថត៖ David Sim / CC BY 2.0',
    statusLabel: 'ទឹកឡើងខ្សោយ',
    status: 'ទឹកកំពុងឡើងយឺត',
    levelLabel: 'កម្ពស់ទឹកឥឡូវនេះ',
    lower: 'ទាបជាងធម្មតា ៣៥%',
    usualToday: 'កម្ពស់ធម្មតាថ្ងៃនេះ៖ ៦.៥ ម',
    explanation: 'ទឹកបឹងទាបជាងធម្មតាច្រើនសម្រាប់ពេលនេះនៃឆ្នាំ។ ស្រែទាបប្រហែលមិនទាន់មានទឹកគ្រប់គ្រាន់ទេ។',
    actionLabel: 'អ្វីដែលអ្នកគួរធ្វើ',
    actionTitle: 'រង់ចាំ ៧ ថ្ងៃទៀត មុនដាំស្រូវនៅស្រែទាប។',
    actionBody: 'ពិនិត្យព័ត៌មានថ្មីម្ដងទៀត មុនរៀបចំដី។',
    hear: 'ស្តាប់ការណែនាំជាភាសាខ្មែរ',
    stopAudio: 'បញ្ឈប់សំឡេងខ្មែរ',
    loadingAudio: 'កំពុងទាញយកសំឡេងខ្មែរ…',
    audioUnavailable: 'មិនអាចចាក់សំឡេងខ្មែរបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត។',
    playing: 'កំពុងចាក់ការណែនាំជាភាសាខ្មែរ…',
    audioDisclosure: 'សំឡេងខ្មែរបង្កើតដោយ AI',
    forecast: 'ការព្យាករណ៍ពេញលេញ',
    outlookTitle: 'ការព្យាករណ៍ទឹក',
    outlookSummary: 'ទឹកនឹងបន្តឡើង ប៉ុន្តែនៅតែទាបជាងកម្រិតធម្មតាតាមរដូវ។',
    forecastRows: [
      { when: 'ថ្ងៃនេះ', state: 'ឡើងយឺត', note: 'ជំនន់ខ្សោយ', value: '៤.២ ម', width: '38%', tone: 'warning' },
      { when: 'ថ្ងៃស្អែក', state: 'បន្តឡើង', note: 'ទាបជាងធម្មតា', value: '៤.៣ ម', width: '44%', tone: 'warning' },
      { when: '៣ ថ្ងៃទៀត', state: 'ឡើងថេរ', note: 'ទាបជាងធម្មតា', value: '៤.៥ ម', width: '53%', tone: 'info' },
      { when: '៧ ថ្ងៃទៀត', state: 'ជំនន់ខ្សោយ', note: 'តាមដានការដាំដុះ', value: '៤.៨ ម', width: '64%', tone: 'info' },
    ],
    detailsTitle: 'ទិន្នន័យថ្ងៃនេះ',
    usualLevel: 'កម្ពស់ទឹកធម្មតា',
    deviation: 'ភាពខុសពីធម្មតា',
    nearestGauge: 'ឧបករណ៍វាស់ទឹកជិតបំផុត',
    stationsOnline: 'ស្ថានីយដំណើរការ',
    stationDistance: 'ចម្ងាយ ១.២ គម',
    onlineValue: '១០ ក្នុងចំណោម ១២',
    levelTitle: 'ប្រៀបធៀបកម្ពស់ទឹក',
    levelMeaning: 'កម្ពស់ទឹកថ្ងៃនេះទាបជាងកម្ពស់ធម្មតាតាមរដូវ ២.៣ ម។',
    current: 'ឥឡូវ · ៤.២ ម',
    expected: 'ធម្មតា · ៦.៥ ម',
    currentShort: 'ឥឡូវនេះ',
    expectedShort: 'ធម្មតាថ្ងៃនេះ',
    lowerShort: 'ទាបជាងធម្មតា',
    chartOpen: 'មើលតារាងទឹកលម្អិត',
    chartNote: 'កម្ពស់ទឹកបច្ចុប្បន្ននៅតែទាបជាងការឡើងទឹកធម្មតា។',
    chartCurrent: 'ទឹកបច្ចុប្បន្ន',
    chartExpected: 'កម្រិតធម្មតា',
    nearbyTitle: 'ឧបករណ៍វាស់ទឹកនៅជិត',
    nearbyBody: 'មើលទិន្នន័យជុំវិញភូមិរបស់អ្នក',
    alertTitle: 'ការជូនដំណឹងសកម្ម',
    alertBody: 'ការដាំដុះអាចត្រូវពន្យារពេល',
    demo: 'ព័ត៌មានគំរូសម្រាប់ការបង្ហាញ',
  },
};

const khmerGuidance = 'ទឹកកំពុងឡើងយឺត។ សូមរង់ចាំប្រាំពីរថ្ងៃទៀត មុនដាំស្រូវនៅស្រែទាប។';
const khmerGuidanceAudioSources = [
  `${import.meta.env.BASE_URL}audio/home-guidance-km.mp3`,
  `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=km&q=${encodeURIComponent(khmerGuidance)}`,
];

function findKhmerVoice() {
  if (!('speechSynthesis' in window)) return null;
  return window.speechSynthesis.getVoices().find((voice) => {
    const language = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    return language === 'km-kh' || language.startsWith('km-') || language === 'km' || name.includes('khmer');
  }) ?? null;
}

export default function PulsePage({ language = 'en', onNavigate }) {
  const [speechState, setSpeechState] = useState('idle');
  const [khmerVoice, setKhmerVoice] = useState(null);
  const audioRef = useRef(null);
  const audioObjectUrlRef = useRef(null);
  const speechRequestRef = useRef(null);
  const utteranceRef = useRef(null);
  const t = homeCopy[language] ?? homeCopy.en;

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    const updateVoices = () => setKhmerVoice(findKhmerVoice());
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, []);

  useEffect(() => () => {
    speechRequestRef.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (audioObjectUrlRef.current) URL.revokeObjectURL(audioObjectUrlRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const stopKhmerGuidance = () => {
    speechRequestRef.current?.abort();
    speechRequestRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeechState('idle');
  };

  const speakWithDeviceVoice = () => {
    if (!khmerVoice || !('speechSynthesis' in window)) return false;
    const message = new SpeechSynthesisUtterance(khmerGuidance);
    message.lang = 'km-KH';
    message.voice = khmerVoice;
    message.rate = 0.82;
    message.pitch = 1;
    message.volume = 1;
    message.onstart = () => setSpeechState('playing');
    message.onend = () => {
      utteranceRef.current = null;
      setSpeechState('idle');
    };
    message.onerror = (event) => {
      utteranceRef.current = null;
      setSpeechState(event.error === 'canceled' ? 'idle' : 'error');
    };
    utteranceRef.current = message;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(message);
    return true;
  };

  const playKhmerGuidance = async () => {
    if (speechState === 'loading' || speechState === 'playing') {
      stopKhmerGuidance();
      return;
    }

    stopKhmerGuidance();
    setSpeechState('loading');

    const availableAudioSources = [];
    const speechRequest = new AbortController();
    speechRequestRef.current = speechRequest;
    try {
      const apiResponse = await fetch('/api/khmer-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guidanceId: 'home' }),
        signal: speechRequest.signal,
      });
      if (!apiResponse.ok) throw new Error('Speech request failed');
      const audioBlob = await apiResponse.blob();
      if (!audioBlob.size) throw new Error('Speech response was empty');
      const objectUrl = URL.createObjectURL(audioBlob);
      audioObjectUrlRef.current = objectUrl;
      availableAudioSources.push(objectUrl);
    } catch {
      if (speechRequest.signal.aborted) return;
      // Continue with the low-bandwidth browser and device fallbacks below.
    } finally {
      if (speechRequestRef.current === speechRequest) speechRequestRef.current = null;
    }
    availableAudioSources.push(...khmerGuidanceAudioSources);

    let fallbackStarted = false;
    const startFallback = () => {
      if (fallbackStarted) return;
      fallbackStarted = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (!speakWithDeviceVoice()) setSpeechState('error');
    };

    let sourceIndex = 0;
    const tryNextAudioSource = async () => {
      if (sourceIndex >= availableAudioSources.length) {
        startFallback();
        return;
      }

      const audio = new Audio(availableAudioSources[sourceIndex]);
      sourceIndex += 1;
      let sourceFailed = false;
      const tryFollowingSource = () => {
        if (sourceFailed) return;
        sourceFailed = true;
        audio.pause();
        if (audioRef.current === audio) audioRef.current = null;
        tryNextAudioSource();
      };

      audio.preload = 'auto';
      audioRef.current = audio;
      audio.onplaying = () => setSpeechState('playing');
      audio.onended = () => {
        audioRef.current = null;
        setSpeechState('idle');
      };
      audio.onerror = tryFollowingSource;

      try {
        await audio.play();
      } catch {
        tryFollowingSource();
      }
    };

    await tryNextAudioSource();
  };

  const speechButtonLabel = speechState === 'playing'
    ? t.stopAudio
    : speechState === 'loading'
      ? t.loadingAudio
      : t.hear;
  const SpeechIcon = speechState === 'playing' ? Square : Volume2;

  return (
    <div className="page pulse-page home-v3">
      <section className="home-v3-location" aria-label={t.areaLabel}>
        <div>
          <span>{t.areaLabel}</span>
          <strong><MapPin size={19} /> {t.area}</strong>
        </div>
        <div className="home-v3-location-actions">
          <small>{t.updated}</small>
          <button type="button" onClick={() => onNavigate('map')}>{t.changeArea}</button>
        </div>
      </section>

      <section className="home-v3-current">
        <figure className="home-v3-scene">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_floating_village-Tonle_Sap_lake.jpg/1280px-The_floating_village-Tonle_Sap_lake.jpg"
            alt={t.photoAlt}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/tonle-sap-landscape.png';
            }}
          />
          <figcaption>
            <strong>{t.photoPlace}</strong>
            <small>{t.photoCredit}</small>
          </figcaption>
        </figure>

        <div className="home-v3-reading">
          <div className="home-v3-status"><AlertTriangle size={19} /><span>{t.statusLabel}</span></div>
          <h1>{t.status}</h1>
          <p>{t.explanation}</p>
          <div className="home-v3-reading-summary" aria-label={t.levelLabel}>
            <div>
              <span>{t.currentShort}</span>
              <strong>4.2 <small>m</small></strong>
            </div>
            <div className="warning">
              <span>{t.lowerShort}</span>
              <strong>35%</strong>
            </div>
            <div>
              <span>{t.expectedShort}</span>
              <strong>6.5 <small>m</small></strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-v3-guidance">
        <div className="home-v3-guidance-heading">
          <Sprout size={24} />
          <div><small>{t.actionLabel}</small><h2>{t.actionTitle}</h2></div>
        </div>
        <p>{t.actionBody}</p>
        <div className="home-v3-guidance-actions">
          <button
            className={`home-v3-voice ${speechState}`}
            onClick={playKhmerGuidance}
            type="button"
            aria-pressed={speechState === 'playing'}
          >
            <SpeechIcon size={19} fill={speechState === 'playing' ? 'currentColor' : 'none'} /> {speechButtonLabel}
          </button>
          <button className="home-v3-forecast-button" onClick={() => onNavigate('forecast')} type="button">
            {t.forecast} <ArrowRight size={18} />
          </button>
        </div>
        <p className="home-v3-audio-status" role="status" aria-live="polite">
          {speechState === 'playing' && t.playing}
          {speechState === 'error' && t.audioUnavailable}
        </p>
        <small className="home-v3-audio-disclosure"><Info size={13} /> {t.audioDisclosure}</small>
      </section>

      <section className="home-v3-outlook">
        <header className="home-v3-section-heading">
          <div><CalendarDays size={21} /><h2>{t.outlookTitle}</h2></div>
          <button onClick={() => onNavigate('forecast')} type="button">{t.forecast}<ChevronRight size={17} /></button>
        </header>
        <p>{t.outlookSummary}</p>
        <div className="home-v3-outlook-list">
          {t.forecastRows.map((row) => (
            <article className={`home-v3-outlook-row ${row.tone}`} key={row.when}>
              <time>{row.when}</time>
              <div><strong>{row.state}</strong><small>{row.note}</small></div>
              <div className="home-v3-outlook-reading">
                <b>{row.value}</b>
                <span className="home-v3-level-track"><i style={{ width: row.width }} /></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-v3-details">
        <header className="home-v3-section-heading">
          <div><Gauge size={21} /><h2>{t.detailsTitle}</h2></div>
        </header>
        <div className="home-v3-detail-grid">
          <article><Droplets size={20} /><span>{t.usualLevel}</span><strong>6.5 m</strong></article>
          <article><Waves size={20} /><span>{t.deviation}</span><strong>−35%</strong></article>
          <article><Radio size={20} /><span>{t.nearestGauge}</span><strong>{t.stationDistance}</strong></article>
          <article><Wifi size={20} /><span>{t.stationsOnline}</span><strong>{t.onlineValue}</strong></article>
        </div>
      </section>

      <section className="home-v3-trend">
        <header className="home-v3-section-heading">
          <div><Droplets size={21} /><h2>{t.levelTitle}</h2></div>
        </header>
        <p>{t.levelMeaning}</p>
        <div className="home-water-visual" role="img" aria-label={`${t.current}; ${t.expected}`}>
          <div className="water-bar current"><i /><strong>{t.current}</strong></div>
          <div className="water-bar expected"><i /><strong>{t.expected}</strong></div>
        </div>
        <details className="home-chart-details">
          <summary>{t.chartOpen}<ChevronRight size={18} /></summary>
          <p>{t.chartNote}</p>
          <PulseLineChart />
          <div className="chart-legend">
            <span><i className="legend-line actual" /> {t.chartCurrent}</span>
            <span><i className="legend-line expected" /> {t.chartExpected}</span>
          </div>
        </details>
      </section>

      <section className="home-v3-links">
        <button onClick={() => onNavigate('map')} type="button">
          <Radio size={23} />
          <span><strong>{t.nearbyTitle}</strong><small>{t.nearbyBody}</small></span>
          <ChevronRight size={20} />
        </button>
        <button onClick={() => onNavigate('alerts')} type="button">
          <Bell size={23} />
          <span><strong>{t.alertTitle}</strong><small>{t.alertBody}</small></span>
          <ChevronRight size={20} />
        </button>
      </section>

      <p className="demo-note"><Info size={15} /> {t.demo}</p>
    </div>
  );
}
