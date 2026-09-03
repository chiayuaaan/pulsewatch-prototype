# PulseWatch Prototype

A responsive React/Vite prototype that introduces PulseWatch through a cinematic public landing page, then opens the mobile community experience using mock data. The source is modular: every page has its own file, with shared navigation, charts, map UI, and mock data extracted into reusable modules.

## Included screens

- Public PulseWatch landing page
- Pulse overview
- Live station map
- Full station detail and sensor-health view
- Three-month forecast
- Alerts and action guidance
- Mock PulseWatch assistant
- Advanced feature hub
- Adaptive fish-refuge monitoring
- Community observation report and success flow
- Impact evidence and methodology

No backend, SAP tenant, sensor feed, login, or OpenAI API key is required.

## File structure

```text
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

## Production note

All displayed readings and assistant responses are demonstration data. A real deployment must connect verified sensor data, forecast logic, authentication, and secure server-side API integrations.
