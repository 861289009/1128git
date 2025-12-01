/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const COZE_API_URL = 'https://api.coze.cn/v3/chat';
// Prefer client env (Vite) variable; fallback to new provided token
// Use VITE_ prefix for client-side env injection
const RAW_AUTH_TOKEN = ((import.meta as any)?.env?.VITE_COZE_AUTH_TOKEN || '').trim() ||
  'pat_l5ZS2NZ6en25hrnAtwGLQR2PAgaN90stRCnMeJka07HUVVD4ogSoie0AlpOuGXf9';
// Accept inputs like "Authorization: Bearer <token>" or "Bearer <token>" or just "<token>"
const AUTH_TOKEN = RAW_AUTH_TOKEN
  .replace(/^Authorization:\s*Bearer\s*/i, '')
  .replace(/^Bearer\s*/i, '')
  .trim();
const BOT_ID = ((import.meta as any)?.env?.VITE_COZE_BOT_ID || '7578805227093442595');
// Official requirement: fixed user id provided by you
const USER_ID = ((import.meta as any)?.env?.VITE_COZE_USER_ID || 'RootUser_2102399258');

export interface CozeMessage {
  role: string;
  type: string;
  content: string;
  content_type: string;
}

export const streamCozeResponse = async (
  message: string,
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  // 优先尝试同源的 Netlify 函数代理（本地 404 时会自动回退）
  if (typeof window !== 'undefined') {
    try {
      const resp = await fetch('/.netlify/functions/cozeProxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.content || '';
        onChunk(content);
        onComplete();
        return;
      }
    } catch (_) {
      // ignore and fall back to direct SSE
    }
  }
  try {
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: USER_ID,
        stream: true,
        additional_messages: [
          {
            content_type: 'text',
            role: 'user',
            type: 'question',
            content: message,
          },
        ],
        parameters: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Coze API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          const jsonStr = line.replace('data:', '').trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);

            // Check for answer type messages
            if (data.type === 'answer' && data.content) {
              // If it's a delta, it might be partial. 
              // Based on user description, we extract 'content'. 
              // We'll pass it to the callback.
              onChunk(data.content);
            }

            // Handle completion or other events if necessary
            // For now, we rely on the stream ending or specific event types if we knew them.
            // But 'answer' seems to be what we want.

          } catch (e) {
            console.warn('Failed to parse SSE data:', jsonStr, e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error('Coze Stream Error:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
};

// Non-stream helper for environments that always use proxy
export const sendCozeMessage = async (message: string): Promise<string> => {
  const resp = await fetch('/.netlify/functions/cozeProxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!resp.ok) {
    throw new Error(`Proxy error ${resp.status}`);
  }
  const data = await resp.json();
  return data?.content || '';
};

// Coze v1 chat completions (non-stream) via Netlify function, or direct fallback
export const callCozeCompletions = async (question: string): Promise<string> => {
  // Prefer Netlify function if available
  try {
    const resp = await fetch('/.netlify/functions/cozeCompletions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (resp.ok) {
      const data = await resp.json();
      return data?.content || '';
    }
  } catch (_) {
    // fall through to direct
  }

  // Direct call (development only); token from Vite env
  const token = String(((import.meta as any)?.env?.VITE_COZE_AUTH_TOKEN || '')).trim();
  const BOT_ID = String(((import.meta as any)?.env?.VITE_COZE_BOT_ID || '7578805227093442595'));
  const USER_ID = String(((import.meta as any)?.env?.VITE_COZE_USER_ID || 'RootUser_2102399258'));
  const bearer = token.replace(/^Authorization:\s*Bearer\s*/i, '').replace(/^Bearer\s*/i, '').trim();

  const resp = await fetch('https://api.coze.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearer}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: BOT_ID,
      user_id: USER_ID,
      stream: false,
      messages: [{ role: 'user', content: question }],
    }),
  });
  const result = await resp.json();
  if (resp.ok && result?.code === 0) {
    return result?.data?.choices?.[0]?.message?.content || '';
  }
  throw new Error(`Coze v1 error ${resp.status}: ${result?.msg || ''}`);
};
