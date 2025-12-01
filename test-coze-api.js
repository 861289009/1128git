// Test script for Coze API
const COZE_API_URL = 'https://api.coze.cn/v3/chat';
const AUTH_TOKEN = 'pat_l5ZS2NZ6en25hrnAtwGLQR2PAgaN90stRCnMeJka07HUVVD4ogSoie0AlpOuGXf9';
const BOT_ID = '7578805227093442595';
const USER_ID = 'RootUser_2102399258';

async function testCozeAPI() {
    console.log('Testing Coze API...\n');

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
                        content: '你好',
                    },
                ],
                parameters: {},
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Coze API Error: ${response.status} ${response.statusText}`);
        }

        if (!response.body) {
            throw new Error('No response body received');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let messageCount = 0;
        let chunkCount = 0;

        console.log('\nStreaming response:\n');

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('\nStream ended.');
                break;
            }

            chunkCount++;
            const decoded = decoder.decode(value, { stream: true });
            console.log(`\n--- Chunk ${chunkCount} (${value.length} bytes) ---`);
            console.log('Raw:', decoded.substring(0, 200)); // Show first 200 chars

            buffer += decoded;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                console.log('Line:', line.substring(0, 100)); // Show first 100 chars of each line

                if (line.trim().startsWith('data:')) {
                    const jsonStr = line.replace('data:', '').trim();
                    if (!jsonStr) continue;

                    try {
                        const data = JSON.parse(jsonStr);
                        messageCount++;
                        console.log(`\n✓ Message ${messageCount}:`, JSON.stringify(data, null, 2));

                        if (data.type === 'answer' && data.content) {
                            console.log('  → Answer content:', data.content);
                        }
                    } catch (e) {
                        console.warn('✗ Failed to parse SSE data:', jsonStr.substring(0, 100), e.message);
                    }
                }
            }
        }

        console.log('\n✅ Test completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testCozeAPI();
