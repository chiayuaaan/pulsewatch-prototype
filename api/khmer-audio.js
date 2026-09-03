const GUIDANCE = {
  home: 'ទឹកកំពុងឡើងយឺត។ សូមរង់ចាំប្រាំពីរថ្ងៃទៀត មុនដាំស្រូវនៅស្រែទាប។ សូមពិនិត្យព័ត៌មានថ្មីម្ដងទៀត មុនរៀបចំដី។',
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'Khmer speech is not configured' });
  }

  const input = GUIDANCE[request.body?.guidanceId];
  if (!input) return response.status(400).json({ error: 'Unknown guidance message' });

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
        voice: process.env.OPENAI_TTS_VOICE || 'marin',
        input,
        instructions: 'Speak in Khmer. Use a calm, warm community-announcement voice. Speak slowly and clearly, with natural pauses and careful pronunciation.',
        response_format: 'mp3',
        speed: 0.9,
      }),
    });

    if (!openAIResponse.ok) {
      const payload = await openAIResponse.json().catch(() => ({}));
      return response.status(502).json({ error: 'OpenAI speech request failed', detail: payload.error?.message });
    }

    const audio = Buffer.from(await openAIResponse.arrayBuffer());
    if (!audio.length) throw new Error('OpenAI returned no audio');
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader('Content-Length', String(audio.length));
    response.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    return response.status(200).send(audio);
  } catch {
    return response.status(502).json({ error: 'Khmer speech is temporarily unavailable' });
  }
}
