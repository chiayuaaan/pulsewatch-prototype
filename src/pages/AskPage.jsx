import { useState } from 'react';
import { Bot, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { suggestionPrompts } from '../data/mockData';

function mockAnswer(question) {
  const normalized = question.toLowerCase();
  if (normalized.includes('plant')) {
    return 'For Kampong Phluk, the current advisory is to delay low-field planting for 7 days. The water level is 4.2 m—about 35% below the seasonal pattern. Check the next gauge update before preparing the lowest fields.';
  }
  if (normalized.includes('nearest') || normalized.includes('station')) {
    return 'Kampong Phluk Gauge 02 is your nearest station, about 2.4 km away. It is online and last reported 2 minutes ago.';
  }
  if (normalized.includes('weak') || normalized.includes('why')) {
    return 'The pulse is marked weak because the lake is rising more slowly than the 1997–2009 seasonal baseline. Nearby gauges currently show an average deviation of 35%. This status comes from sensor data, not from the assistant.';
  }
  return 'I can explain the latest PulseWatch readings and approved community guidance. For this prototype, try asking about the weak pulse, planting, or your nearest station.';
}

export default function AskPage({ onNavigate }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me about the latest water conditions near Kampong Phluk. I will answer using verified PulseWatch prototype data.',
    },
  ]);

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: mockAnswer(clean) },
    ]);
    setInput('');
  };

  return (
    <div className="page ask-page">
      <section className="ask-hero">
        <div className="ai-orb"><Sparkles size={26} /></div>
        <span className="eyebrow">PULSEWATCH GUIDE</span>
        <h1>Understand the lake<br />in plain language.</h1>
        <p>Answers are grounded in station readings and approved action guidance.</p>
      </section>
      <div className="suggestion-row">
        {suggestionPrompts.map((prompt) => (
          <button key={prompt} onClick={() => sendMessage(prompt)} type="button">{prompt}</button>
        ))}
      </div>
      <section className="chat-panel" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === 'assistant' && <span className="avatar"><Bot size={17} /></span>}
            <div>
              <p>{message.text}</p>
              {message.role === 'assistant' && index > 0 && (
                <button className="source-link" onClick={() => onNavigate('map')} type="button"><ShieldCheck size={14} /> View verified sources</button>
              )}
            </div>
          </div>
        ))}
      </section>
      <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about the pulse..." aria-label="Ask PulseWatch" />
        <button type="submit" disabled={!input.trim()} aria-label="Send question"><Send size={18} /></button>
      </form>
      <p className="assistant-note"><ShieldCheck size={13} /> Prototype assistant · No live AI connection</p>
    </div>
  );
}
