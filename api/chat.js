const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_TOTAL_CHARACTERS = 6000;

const PULSEWATCH_CONTEXT = `
You are the PulseWatch community guidance assistant for people around Tonle Sap.
Use short, direct, calm language that a first-time smartphone user can understand.
Only answer from the verified prototype facts below. If the question cannot be answered from them, say that PulseWatch cannot confirm it yet and suggest the relevant page or a trusted local authority. Never invent live readings, forecasts, medical advice, legal advice, or emergency instructions.

Verified PulseWatch prototype facts:
- Area: Kampong Phluk, Tonle Sap, Cambodia.
- Current water level: 4.2 m. Usual seasonal level today: 6.5 m.
- The water is 35% below normal and is rising slowly. Status: weak water rise / weak pulse.
- Current community action: wait 7 more days before planting low fields, then check the next update before preparing soil.
- Nearest monitoring point: Kampong Phluk Gauge 02, about 2.4 km away, online, updated 2 minutes ago.
- Network: 15 prototype sensor stations around Tonle Sap; 12 are currently shown online.
- The comparison baseline is 1997–2009.
- PulseWatch readings in this prototype are demonstration data, not an emergency service.

Prefer one short paragraph or three brief bullet points. Lead with what is happening, the status, and what the person should do. Clearly label prototype data when relevant.
`.trim();

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string') return payload.output_text;
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && typeof content.text === 'string') return content.text;
    }
  }
  return '';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'PulseWatch guidance is not configured' });
  }

  const messages = request.body?.messages;
  if (!Array.isArray(messages) || !messages.length || messages.length > MAX_MESSAGES) {
    return response.status(400).json({ error: 'Provide between 1 and 10 messages' });
  }

  const cleanMessages = messages.map((message) => ({
    role: message?.role === 'assistant' ? 'assistant' : 'user',
    text: typeof message?.text === 'string' ? message.text.trim() : '',
  }));
  const totalCharacters = cleanMessages.reduce((total, message) => total + message.text.length, 0);
  if (cleanMessages.some((message) => !message.text || message.text.length > MAX_MESSAGE_LENGTH)
    || totalCharacters > MAX_TOTAL_CHARACTERS) {
    return response.status(400).json({ error: 'Messages must be short plain text' });
  }

  const conversation = cleanMessages
    .map((message) => `${message.role === 'assistant' ? 'PulseWatch' : 'User'}: ${message.text}`)
    .join('\n');

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-5.6-luna',
        store: false,
        instructions: PULSEWATCH_CONTEXT,
        input: conversation,
        max_output_tokens: 500,
      }),
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      return response.status(502).json({ error: 'OpenAI guidance request failed', detail: payload.error?.message });
    }

    const answer = extractOutputText(payload).trim();
    if (!answer) throw new Error('OpenAI returned no answer');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).json({ answer });
  } catch {
    return response.status(502).json({ error: 'PulseWatch guidance is temporarily unavailable' });
  }
}
