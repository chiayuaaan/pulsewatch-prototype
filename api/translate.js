const MAX_TEXTS = 60;
const MAX_TEXT_LENGTH = 1200;
const MAX_TOTAL_CHARACTERS = 8000;
const REQUEST_TIMEOUT_MS = 25000;

function extractOutputText(response) {
  if (typeof response.output_text === 'string') return response.output_text;
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && typeof content.text === 'string') return content.text;
    }
  }
  return '';
}

function createTranslationRequest(texts) {
  const keys = texts.map((_, index) => `item_${index}`);
  const sourceText = Object.fromEntries(keys.map((key, index) => [key, texts[index]]));
  const translationProperties = Object.fromEntries(keys.map((key) => [key, { type: 'string' }]));

  return {
    keys,
    sourceText,
    schema: {
      type: 'object',
      properties: translationProperties,
      required: keys,
      additionalProperties: false,
    },
  };
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
    const { keys, sourceText, schema } = createTranslationRequest(texts);
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

    let openAIResponse;
    try {
      openAIResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5.6-terra',
          store: false,
          reasoning: { effort: 'none' },
          input: [
            {
              role: 'system',
              content: [
                {
                  type: 'input_text',
                  text: 'Translate every value in the supplied JSON object from English into natural, respectful Khmer for villagers around Tonle Sap. Keep every key unchanged. Keep the language short and practical. Preserve numbers, measurements, dates, URLs, sensor IDs and official place names. Return only the schema-conforming translation object.',
                },
              ],
            },
            { role: 'user', content: [{ type: 'input_text', text: JSON.stringify(sourceText) }] },
          ],
          max_output_tokens: 6000,
          text: {
            verbosity: 'low',
            format: {
              type: 'json_schema',
              name: 'pulsewatch_ui_translation',
              strict: true,
              schema,
            },
          },
        }),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      return response.status(502).json({ error: 'OpenAI translation request failed', detail: payload.error?.message });
    }
    if (payload.status !== 'completed') {
      const reason = payload.incomplete_details?.reason || payload.status || 'unknown reason';
      throw new Error(`OpenAI translation response was incomplete: ${reason}`);
    }

    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error('OpenAI returned no translation text');
    const parsed = JSON.parse(outputText);
    const translations = keys.map((key) => parsed[key]);
    if (translations.some((translation) => typeof translation !== 'string' || !translation.trim())) {
      throw new Error('OpenAI translation response was missing an item');
    }

    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return response.status(200).json({ translations });
  } catch (error) {
    const detail = error?.name === 'AbortError'
      ? 'OpenAI translation request timed out'
      : error?.message || 'Unknown translation error';
    console.error(`[PulseWatch translation] ${detail}`);
    return response.status(502).json({ error: 'Khmer translation is temporarily unavailable', detail });
  }
}
