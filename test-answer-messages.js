// Detailed test to see answer messages
const COZE_API_URL = 'https://api.coze.cn/v3/chat';
const AUTH_TOKEN = 'cztei_q89RVrMU6FXnsQjDdTOiqEVMSRK6ce11iQB2KnUTzjvxWPzM5O1ASDFF4aVIsabDV';
const BOT_ID = '7577668337417879592';
const WORKFLOW_ID = '7577668574502191104';

async function testCozeAPI() {
    console.log('Testing Coze API for answer messages...\n');

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
                user_id: '123456789',
                stream: true,
                additional_messages: [
                    {
                        content_type: 'text',
                        role: 'user',
                        type: 'question',
                        content: '介绍一下扣子',
                    },
                ],
                parameters: {},
            }),
        });

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
        let answerMessages = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim().startsWith('data:')) {
                    const jsonStr = line.replace('data:', '').trim();
                    if (!jsonStr || jsonStr === '[DONE]') continue;

                    try {
                        const data = JSON.parse(jsonStr);

                        // Look for answer type messages
                        if (data.type === 'answer') {
                            answerMessages.push(data);
                            console.log('\n📝 Answer Message Found:');
                            console.log('  Type:', data.type);
                            console.log('  Content:', data.content);
                            console.log('  Full data:', JSON.stringify(data, null, 2));
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }
        }

        console.log(`\n\n✅ Total answer messages: ${answerMessages.length}`);

        if (answerMessages.length > 0) {
            console.log('\n📋 Summary of all answers:');
            answerMessages.forEach((msg, idx) => {
                console.log(`  ${idx + 1}. ${msg.content}`);
            });
        } else {
            console.log('\n⚠️ No answer messages found. Let me check all message types...');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testCozeAPI();
