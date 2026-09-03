import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Download,
  Droplets,
  Gauge,
  Languages,
  LogOut,
  Map,
  MapPin,
  Radio,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  Waves,
  Wrench,
  X,
} from 'lucide-react';
import AdminPulseChart, { getPulseChartSummary } from '../components/charts/AdminPulseChart';
import BrandMark from '../components/BrandMark';
import { stations } from '../data/mockData';

const periods = ['24H', '7D', '30D'];

const responseItems = [
  {
    id: 'PW-A14',
    tone: 'critical',
    area: 'Kampong Luong',
    title: 'Critical seasonal deviation',
    detail: '44% below expected · notify fisheries response team',
    action: 'Review response',
  },
  {
    id: 'PW-A12',
    tone: 'warning',
    area: 'Pursat River Mouth',
    title: 'Low water threshold crossed',
    detail: '3.8 m · verify reading with nearby community report',
    action: 'Open evidence',
  },
  {
    id: 'PW-M08',
    tone: 'offline',
    area: 'Three sensor locations',
    title: 'Maintenance visit required',
    detail: 'Battery or signal failure · service window within 24 hours',
    action: 'Assign team',
  },
];

function stationMatchesFilter(station, filter) {
  if (filter === 'online') return station.online;
  if (filter === 'attention') return station.tone === 'amber' || station.tone === 'red';
  if (filter === 'offline') return !station.online;
  return true;
}

export default function AdminPage({ language = 'en', onToggleLanguage, onSignOut }) {
  const [period, setPeriod] = useState('7D');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const onlineCount = stations.filter((station) => station.online).length;
  const weakCount = stations.filter((station) => station.tone === 'amber').length;
  const criticalCount = stations.filter((station) => station.tone === 'red').length;
  const summary = getPulseChartSummary(period);

  const filteredStations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return stations.filter((station) => stationMatchesFilter(station, filter))
      .filter((station) => !normalized || `${station.name} ${station.code} ${station.status}`.toLowerCase().includes(normalized));
  }, [filter, query]);

  const refreshDashboard = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };

  const exportNetworkData = () => {
    const headings = ['Station', 'Code', 'Status', 'Water level', 'Deviation', 'Last update', 'Battery', 'Signal'];
    const rows = stations.map((station) => [station.name, station.code, station.status, station.level, station.delta, station.lastSeen, `${station.battery}%`, station.signal]);
    const csv = [headings, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pulsewatch-sensor-network.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const openResponse = (item) => {
    if (item.id === 'PW-M08') {
      setFilter('offline');
      jumpTo('admin-network');
      return;
    }

    const station = stations.find((entry) => item.area.includes(entry.name) || entry.name.includes(item.area));
    if (station) setSelectedStation(station);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <div className="admin-brand">
          <BrandMark />
          <span><strong>PulseWatch</strong><small>Authority workspace</small></span>
        </div>
        <nav aria-label="Dashboard sections">
          <button onClick={() => jumpTo('admin-overview')} type="button">Overview</button>
          <button onClick={() => jumpTo('admin-response')} type="button">Response</button>
          <button onClick={() => jumpTo('admin-map')} type="button">Map</button>
          <button onClick={() => jumpTo('admin-network')} type="button">Sensor network</button>
        </nav>
        <div className="admin-topbar-actions">
          <button className="admin-language-toggle" data-no-translate onClick={onToggleLanguage} type="button" aria-label={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}><Languages size={16} /> {language === 'en' ? 'ខ្មែរ' : 'English'}</button>
          <button className="admin-icon-button" onClick={refreshDashboard} type="button" aria-label="Refresh dashboard"><RefreshCw className={refreshing ? 'spin' : ''} size={17} /></button>
          <button className="admin-exit" onClick={onSignOut} type="button"><LogOut size={16} /> Sign out</button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-intro" id="admin-overview">
          <div>
            <span className="admin-kicker"><i /> Live operations · Tonle Sap basin</span>
            <h1>Flood-pulse command centre</h1>
            <p>One operational view for MRC teams, ministries, NGOs and field coordinators.</p>
          </div>
          <div className="admin-intro-actions">
            <span><ShieldCheck size={15} /> Last sync {refreshing ? 'updating…' : '2 min ago'}</span>
            <button onClick={exportNetworkData} type="button"><Download size={16} /> Export sensor data</button>
          </div>
        </section>

        <section className="admin-status-banner">
          <div className="admin-status-symbol"><Waves size={28} /></div>
          <div><span>Network assessment</span><strong>Weak flood pulse</strong><p>Water is rising, but the monitored lake average remains 35% below the seasonal pattern.</p></div>
          <button onClick={() => jumpTo('admin-map')} type="button">Open live map <ArrowRight size={16} /></button>
        </section>

        <section className="admin-kpi-grid" aria-label="Network overview">
          <article className="admin-kpi-card teal">
            <div><span>Stations online</span><Radio size={18} /></div>
            <strong><b>{onlineCount}</b><small>/ {stations.length}</small></strong>
            <p>80% network availability</p>
            <i style={{ '--progress': `${(onlineCount / stations.length) * 100}%` }} />
          </article>
          <article className="admin-kpi-card orange">
            <div><span>Weak-pulse zones</span><AlertTriangle size={18} /></div>
            <strong><b>{weakCount}</b><small>areas</small></strong>
            <p>2 require planting guidance</p>
            <i style={{ '--progress': `${(weakCount / stations.length) * 100}%` }} />
          </article>
          <article className="admin-kpi-card red">
            <div><span>Critical / offline</span><ServerCog size={18} /></div>
            <strong><b>{criticalCount}</b><small>stations</small></strong>
            <p>3 maintenance visits pending</p>
            <i style={{ '--progress': `${(criticalCount / stations.length) * 100}%` }} />
          </article>
          <article className="admin-kpi-card cream">
            <div><span>Community evidence</span><CheckCircle2 size={18} /></div>
            <strong><b>28</b><small>reports</small></strong>
            <p>9 verified in the last 24 hours</p>
            <i style={{ '--progress': '64%' }} />
          </article>
        </section>

        <section className="admin-analytics-grid">
          <article className="admin-panel admin-chart-panel">
            <div className="admin-panel-heading">
              <div><span>Water level · network average</span><h2>Actual pulse vs seasonal baseline</h2></div>
              <div className="admin-period-control" aria-label="Chart time range">
                {periods.map((item) => <button className={period === item ? 'active' : ''} onClick={() => setPeriod(item)} type="button" key={item}>{item}</button>)}
              </div>
            </div>
            <div className="admin-chart-summary">
              <strong>{summary.current.toFixed(1)} m</strong>
              <span><b>−{summary.percentage}%</b> from expected · {summary.difference.toFixed(1)} m gap</span>
            </div>
            <div className="admin-chart-legend"><span><i className="actual" /> Actual</span><span><i className="baseline" /> Seasonal baseline</span></div>
            <AdminPulseChart period={period} key={period} />
          </article>

          <article className="admin-panel admin-health-panel">
            <div className="admin-panel-heading"><div><span>System health</span><h2>Network availability</h2></div><Activity size={19} /></div>
            <div className="admin-health-gauge">
              <svg viewBox="0 0 180 180" role="img" aria-label="80 percent network availability">
                <circle className="track" cx="90" cy="90" r="66" />
                <circle className="value" cx="90" cy="90" r="66" pathLength="100" strokeDasharray="80 100" />
              </svg>
              <div><strong>80%</strong><span>operational</span></div>
            </div>
            <dl className="admin-health-list">
              <div><dt><i className="green" />Online</dt><dd>{onlineCount}</dd></div>
              <div><dt><i className="amber" />Weak signal</dt><dd>2</dd></div>
              <div><dt><i className="red" />Offline</dt><dd>{stations.length - onlineCount}</dd></div>
            </dl>
            <button onClick={() => jumpTo('admin-network')} type="button">Inspect all sensors <ArrowRight size={15} /></button>
          </article>
        </section>

        <section className="admin-section" id="admin-response">
          <div className="admin-section-heading">
            <div><span>Operational queue</span><h2>Priority response</h2></div>
            <small>5 active issues · ordered by urgency</small>
          </div>
          <div className="admin-response-list">
            {responseItems.map((item, index) => (
              <article className={`admin-response-item ${item.tone}`} key={item.id} style={{ '--delay': `${index * 70}ms` }}>
                <span className="admin-response-index">0{index + 1}</span>
                <div><small>{item.id} · {item.area}</small><strong>{item.title}</strong><p>{item.detail}</p></div>
                <button onClick={() => openResponse(item)} type="button">{item.action}<ArrowRight size={14} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" id="admin-map">
          <div className="admin-section-heading">
            <div><span>Authority map</span><h2>Live station geography</h2></div>
            <small>Select a station to inspect its operational details.</small>
          </div>
          <div className="admin-network-map">
            <iframe
              title="Satellite map of the Tonle Sap sensor network"
              src="https://maps.google.com/maps?ll=12.82%2C104.02&t=k&z=8&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="admin-map-shade" aria-hidden="true" />
            <span className="admin-map-count"><Radio size={13} /> 15 stations</span>
            {stations.map((station) => (
              <button
                className={`admin-map-pin ${station.tone}`}
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
                onClick={() => setSelectedStation(station)}
                type="button"
                aria-label={`Open ${station.name} sensor details`}
                key={station.id}
              >
                <span>{station.code.slice(-2)}</span>
              </button>
            ))}
            <div className="admin-map-legend"><span><i className="green" />On schedule</span><span><i className="amber" />Weak pulse</span><span><i className="red" />Critical or offline</span></div>
          </div>
        </section>

        <section className="admin-section admin-network-section" id="admin-network">
          <div className="admin-section-heading">
            <div><span>Live telemetry</span><h2>15-sensor network</h2></div>
            <button className="admin-map-link" onClick={() => jumpTo('admin-map')} type="button"><Map size={16} /> View authority map <ArrowRight size={13} /></button>
          </div>

          <div className="admin-network-tools">
            <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search station or code" /></label>
            <div aria-label="Filter sensor stations">
              {[
                ['all', 'All 15'],
                ['online', 'Online'],
                ['attention', 'Needs attention'],
                ['offline', 'Offline'],
              ].map(([value, label]) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} type="button" key={value}>{label}</button>)}
            </div>
          </div>

          <div className="admin-sensor-table" role="region" aria-label={`${filteredStations.length} sensor stations`}>
            <div className="admin-sensor-row header" role="row">
              <span>Station</span><span>Condition</span><span>Water</span><span>Deviation</span><span>Battery</span><span>Updated</span><span />
            </div>
            {filteredStations.map((station, index) => (
              <button className="admin-sensor-row" onClick={() => setSelectedStation(station)} type="button" role="row" key={station.id} style={{ '--delay': `${Math.min(index, 8) * 35}ms` }}>
                <span className="admin-station-name"><i className={station.tone}><Radio size={14} /></i><span><strong>{station.name}</strong><small>{station.code} · {station.signal}</small></span></span>
                <span><em className={station.tone}><CircleDot size={10} />{station.status}</em></span>
                <span><strong>{station.level}</strong></span>
                <span>{station.delta}</span>
                <span className="admin-battery"><i><b style={{ width: `${station.battery}%` }} /></i>{station.battery}%</span>
                <span>{station.lastSeen}</span>
                <span><ArrowRight size={14} /></span>
              </button>
            ))}
            {!filteredStations.length && <div className="admin-empty-state"><Gauge size={24} /><strong>No matching stations</strong><span>Try a different name or status filter.</span></div>}
          </div>
        </section>

        <footer className="admin-footer"><Droplets size={15} /><span>PulseWatch authority prototype · Demonstration data · Last generated 03 Sep 2026</span><Wrench size={15} /></footer>
      </main>

      {selectedStation && (
        <div className="admin-drawer-layer">
          <button className="admin-drawer-backdrop" type="button" onClick={() => setSelectedStation(null)} aria-label="Close sensor details" />
          <aside className="admin-sensor-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-sensor-title">
            <header>
              <div><span>Sensor detail · {selectedStation.code}</span><h2 id="admin-sensor-title">{selectedStation.name}</h2></div>
              <button type="button" onClick={() => setSelectedStation(null)} aria-label="Close sensor details"><X size={20} /></button>
            </header>
            <div className={`admin-drawer-status ${selectedStation.tone}`}><CircleDot size={13} /><strong>{selectedStation.status}</strong><span>{selectedStation.lastSeen}</span></div>
            <dl>
              <div><dt>Current water</dt><dd>{selectedStation.level}</dd></div>
              <div><dt>Seasonal baseline</dt><dd>{selectedStation.expected}</dd></div>
              <div><dt>Deviation</dt><dd>{selectedStation.delta}</dd></div>
              <div><dt>Battery</dt><dd>{selectedStation.battery}%</dd></div>
              <div><dt>Network signal</dt><dd>{selectedStation.signal}</dd></div>
              <div><dt>Installed</dt><dd>{selectedStation.installed}</dd></div>
            </dl>
            <section>
              <span><MapPin size={15} /> Station coordinates</span>
              <strong>{selectedStation.lat.toFixed(4)}° N, {selectedStation.lng.toFixed(4)}° E</strong>
            </section>
            <button className="admin-drawer-action" type="button" onClick={() => setSelectedStation(null)}>Done</button>
          </aside>
        </div>
      )}
    </div>
  );
}
