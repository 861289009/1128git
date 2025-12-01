/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const COZE_API_URL = 'https://api.coze.cn/v3/chat';
// Prefer environment variable; fallback to the provided token
const RAW_AUTH_TOKEN = (process.env.COZE_AUTH_TOKEN || '').trim() ||
  'cztei_lYwGb4b98GwyMzBAcDJOOPobx1hV28EBCbRi8Mew1XrgiwbZXygt2pdAec12vUX79';
// Accept inputs like "Authorization: Bearer <token>" or "Bearer <token>" or just "<token>"
const AUTH_TOKEN = RAW_AUTH_TOKEN
  .replace(/^Authorization:\s*Bearer\s*/i, '')
  .replace(/^Bearer\s*/i, '')
  .trim();
const BOT_ID = (process.env.COZE_BOT_ID || '7577668337417879592');
const WORKFLOW_ID = (process.env.COZE_WORKFLOW_ID || '7577668574502191104');

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
  try {
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        workflow_id: WORKFLOW_ID,
        user_id: 'user_' + Date.now(), // Unique session ID
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
