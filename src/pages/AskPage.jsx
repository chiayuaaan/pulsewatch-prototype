import { useState } from 'react';
import { Bot, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { suggestionPrompts } from '../data/mockData';

export default function AskPage({ onNavigate }) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me about the latest water conditions near Kampong Phluk. I will answer using verified PulseWatch prototype data.',
    },
  ]);

  const sendMessage = async (text) => {
    const clean = text.trim();
    if (!clean || sending) return;

    const nextMessages = [...messages, { role: 'user', text: clean }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setSending(true);

    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const payload = await apiResponse.json();
      if (!apiResponse.ok || typeof payload.answer !== 'string') {
        throw new Error(payload.error || 'The guidance service did not return an answer.');
      }
      setMessages((current) => [...current, { role: 'assistant', text: payload.answer }]);
    } catch {
      setError('PulseWatch could not reach the guidance service. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
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
          <button key={prompt} onClick={() => sendMessage(prompt)} disabled={sending} type="button">{prompt}</button>
        ))}
      </div>
      <section className="chat-panel" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === 'assistant' && <span className="avatar"><Bot size={17} /></span>}
            <div>
              <p data-no-translate={message.role === 'user' ? 'true' : undefined}>{message.text}</p>
              {message.role === 'assistant' && index > 0 && (
                <button className="source-link" onClick={() => onNavigate('map')} type="button"><ShieldCheck size={14} /> View verified sources</button>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="message assistant pending" aria-label="PulseWatch is preparing an answer">
            <span className="avatar"><Bot size={17} /></span>
            <div><p><span className="chat-loading-dot" /><span className="chat-loading-dot" /><span className="chat-loading-dot" /></p></div>
          </div>
        )}
      </section>
      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about the pulse..." aria-label="Ask PulseWatch" disabled={sending} />
        <button type="submit" disabled={!input.trim() || sending} aria-label="Send question"><Send size={18} /></button>
      </form>
      <p className="assistant-note"><ShieldCheck size={13} /> OpenAI guide · Answers limited to verified prototype readings</p>
    </div>
  );
}
