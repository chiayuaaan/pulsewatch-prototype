const MAX_TEXTS = 60;
const MAX_TEXT_LENGTH = 1200;
const MAX_TOTAL_CHARACTERS = 8000;

function extractOutputText(response) {
  if (typeof response.output_text === 'string') return response.output_text;
  for (const item of response.output ?? []) {
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
    return response.status(503).json({ error: 'Khmer translation is not configured' });
  }

  const texts = request.body?.texts;
  if (!Array.isArray(texts) || !texts.length || texts.length > MAX_TEXTS) {
    return response.status(400).json({ error: 'Provide between 1 and 60 text items' });
  }
  if (texts.some((text) => typeof text !== 'string' || text.length > MAX_TEXT_LENGTH)
    || texts.reduce((total, text) => total + text.length, 0) > MAX_TOTAL_CHARACTERS) {
    return response.status(400).json({ error: 'Each text item must be a short string' });
  }

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5.6-luna',
        store: false,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: 'Translate PulseWatch user-interface text from English into natural, respectful Khmer for villagers around Tonle Sap. Keep the language short and practical. Preserve numbers, measurements, dates, URLs, sensor IDs and official place names. Return one translation for every input, in the same order, with no commentary.',
              },
            ],
          },
          { role: 'user', content: [{ type: 'input_text', text: JSON.stringify(texts) }] },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'pulsewatch_ui_translation',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                translations: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
              required: ['translations'],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      return response.status(502).json({ error: 'OpenAI translation request failed', detail: payload.error?.message });
    }

    const outputText = extractOutputText(payload);
    const parsed = JSON.parse(outputText);
    if (!Array.isArray(parsed.translations) || parsed.translations.length !== texts.length) {
      throw new Error('Translation count did not match the request');
    }

    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return response.status(200).json({ translations: parsed.translations });
  } catch {
    return response.status(502).json({ error: 'Khmer translation is temporarily unavailable' });
  }
}
