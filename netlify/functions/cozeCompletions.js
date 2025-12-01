// Netlify Function: Coze v1 chat completions (non-stream)

const API_URL = 'https://api.coze.cn/v1/chat/completions';

exports.handler = async (event) => {
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
    const body = JSON.parse(event.body || '{}');
    const question = body.question || body.message || '';
    const messages = Array.isArray(body.messages) ? body.messages : undefined;

    const rawToken = (process.env.COZE_AUTH_TOKEN || '').trim();
    const token = rawToken
      .replace(/^Authorization:\s*Bearer\s*/i, '')
      .replace(/^Bearer\s*/i, '')
      .trim();

    const BOT_ID = body.botId || process.env.COZE_BOT_ID || '7578805227093442595';
    const USER_ID = body.userId || process.env.COZE_USER_ID || 'RootUser_2102399258';

    const payload = {
      bot_id: BOT_ID,
      user_id: USER_ID,
      stream: false,
      messages: messages ?? [{ role: 'user', content: question }],
    };

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await resp.json().catch(async () => {
      const text = await resp.text();
      return { parse_error: true, raw: text };
    });

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'coze_completions_error', status: resp.status, result }),
      };
    }

    let content = '';
    try {
      if (result && result.code === 0 && result.data && result.data.choices) {
        const choice = result.data.choices[0];
        content = choice?.message?.content || '';
      }
    } catch (_) {}

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ content, raw: result }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'coze_completions_proxy_failure', message: String(err?.message || err) }),
    };
  }
};

