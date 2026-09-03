# PulseWatch Prototype

A responsive React/Vite prototype that introduces PulseWatch through a cinematic public landing page, then opens the mobile community experience using mock data. The source is modular: every page has its own file, with shared navigation, charts, map UI, and mock data extracted into reusable modules.

## Included screens

- Public PulseWatch landing page
- Pulse overview
- Live station map
- Full station detail and sensor-health view
- Three-month forecast
- Alerts and action guidance
- OpenAI-powered PulseWatch guidance assistant, restricted to prototype readings
- AI-generated Khmer audio guidance with browser and device fallbacks
- App-wide English-to-Khmer interface translation with local caching
- Separate authority sign-in and operations dashboard
- Advanced feature hub
- Adaptive fish-refuge monitoring
- Community observation report and success flow
- Impact evidence and methodology

The displayed sensor readings remain demonstration data. Khmer translation, the guidance assistant, and Khmer audio use small server-side Vercel functions so the OpenAI API key is never exposed in the browser.

## File structure

```text
api/
├── chat.js                   Grounded guidance assistant endpoint
├── khmer-audio.js           Khmer text-to-speech endpoint
└── translate.js              Secure Khmer translation endpoint
src/
├── App.jsx                    Small navigation controller
├── components/
│   ├── AppHeader.jsx
│   ├── BottomNav.jsx
│   ├── BrandMark.jsx
│   ├── LakeMap.jsx
│   └── charts/
│       ├── ForecastGraph.jsx
│       └── PulseLineChart.jsx
├── data/
│   ├── mockData.js
│   └── navigation.js
├── hooks/
│   └── useAutoTranslate.js    Shared translation and browser cache
└── pages/
    ├── AlertsPage.jsx
    ├── AskPage.jsx
    ├── ForecastPage.jsx
    ├── ImpactPage.jsx
    ├── LandingPage.jsx
    ├── MapPage.jsx
    ├── MorePage.jsx
    ├── PulsePage.jsx
    ├── RefugesPage.jsx
    ├── ReportPage.jsx
    └── StationPage.jsx
```

Edit a screen inside `src/pages/`. Change prototype readings, stations, refuges, metrics, alerts, and report categories inside `src/data/mockData.js`.

## Run in VS Code

Open this folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. For the intended layout, use a phone-sized browser window or your browser's mobile device preview.

## Enable OpenAI features

Add these environment variables in Vercel under **Project → Settings → Environment Variables**, then redeploy:

```text
OPENAI_API_KEY=your_key_here
OPENAI_TRANSLATION_MODEL=gpt-5.6-luna
OPENAI_CHAT_MODEL=gpt-5.6-luna
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
```

Only `OPENAI_API_KEY` is required; the model and voice variables above are optional overrides. The first translation of a screen is requested in batches. Results are cached in the browser, so previously translated screens can be reused on a slow or interrupted connection. Never place the API key in a variable beginning with `VITE_` because that would expose it to visitors.

## Production note

All displayed readings and assistant responses are demonstration data. A real deployment must connect verified sensor data, forecast logic, authentication, and secure server-side API integrations.
