// Netlify Function: Proxy Coze API to avoid browser CORS and keep token server-side

const COZE_API_URL = 'https://api.coze.cn/v3/chat';

exports.handler = async (event) => {
  // Preflight for CORS (if ever used cross-origin)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    if (!message || typeof message !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing message' }) };
    }

    const rawToken = (process.env.COZE_AUTH_TOKEN || 'pat_l5ZS2NZ6en25hrnAtwGLQR2PAgaN90stRCnMeJka07HUVVD4ogSoie0AlpOuGXf9').trim();
    const token = rawToken
      .replace(/^Authorization:\s*Bearer\s*/i, '')
      .replace(/^Bearer\s*/i, '')
      .trim();

    const BOT_ID = process.env.COZE_BOT_ID || '7577668337417879592';
    const WORKFLOW_ID = process.env.COZE_WORKFLOW_ID || '7577668574502191104';

    const res = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        workflow_id: WORKFLOW_ID,
        user_id: 'user_' + Date.now(),
        stream: false,
        additional_messages: [
          { content_type: 'text', role: 'user', type: 'question', content: message },
        ],
        parameters: {},
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Coze error', status: res.status, body: text }),
      };
    }

    // Try parse JSON to extract content; if unknown, return raw text
    let content = '';
    try {
      const data = JSON.parse(text);
      // Attempt common shapes
      if (data && data.content) content = data.content;
      else if (Array.isArray(data.messages)) {
        const ans = data.messages.find(m => m.role === 'assistant' && m.content);
        content = ans?.content || '';
      }
    } catch (_) {
      // not JSON, keep raw
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ content: content || text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Proxy failure', message: String(err && err.message || err) }),
    };
  }
};
