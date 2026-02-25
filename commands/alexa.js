const axios = require('axios');

const apiKeys = [
'csk-fhyxhr6dxx9twymw543nkjr3x6ynwvj8r8phtvpxwdnkp5cx',
'csk-2cp8yrkdy86nh26w3d8d8h5fjvtrwr3mtfwkk5vfmrfvtt9m',
'csk-3rx2kr6htdck5v8erj699cdwnvn9twwh9e9mevnxvmpxp8pe',
'csk-k4cpw68nwkyfd5685464tey5ctwk6cd46ck2cc4p29n6rpve',
'csk-5whkxw32emp33nv99dyvcv9hm4fx8x8ffvncfyyfrn265np9',
'csk-k3rpw3xh225hcxdpjc2edj3wynw4r9kf4c6xc63djmpxj8tf',
'csk-wyn2fedyfwcfv4c992w4kf4rfrrf8x94ed58ndd2wnfd5d8w',
'csk-rr6j59ym83y43fett5kmvyj8w58tjv3m4y24dep2h8fym2vk',
'csk-ww669p9x34mcmr36nkpek32v6ywdpnpn682xhy56t3d3f3re',
'csk-p5kjy6fnjpp58jfmmtp464wfejpk8rynpfn64hwpnmv9ew6f'
];

const messageHistories = {};

async function alexaCommand(sock, chatId, message) {
    try {
        const m = message?.message;
        const text = m?.conversation || m?.extendedTextMessage?.text || m?.imageMessage?.caption || m?.videoMessage?.caption;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .alexa\n\nExample: .alexa hello"
            }, {
                quoted: message
            });
        }

        const query = text.split(/\s+/).slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .alexa"
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key }
        });

        // Maintain history  
        if (!messageHistories[chatId]) {
            messageHistories[chatId] = [
                { role: "system", content: "You are Alexa, a human-like assistant from Karachi. You talk in a friendly, slightly naughty, and flirty way. Use Urdu/English mix (Hinglish) sometimes." }
            ];
        }

        messageHistories[chatId].push({ role: "user", content: query });

        // Keep last 15 messages (plus system prompt)  
        if (messageHistories[chatId].length > 16) {
            messageHistories[chatId] = [
                messageHistories[chatId][0],
                ...messageHistories[chatId].slice(-15)
            ];
        }

        const CEREBRAS_API_KEY = apiKeys[Math.floor(Math.random() * apiKeys.length)];

        const res = await axios.post('https://api.cerebras.ai/v1/chat/completions', {
            messages: messageHistories[chatId],
            model: 'llama-3.3-70b',
            max_completion_tokens: 180,
            temperature: 0.9,
            top_p: 0.95
        }, {
            headers: {
                'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 14000
        });

        if (res.data && res.data.choices && res.data.choices[0].message) {
            const answer = res.data.choices[0].message.content;
            messageHistories[chatId].push({ role: "assistant", content: answer });

            await sock.sendMessage(chatId, {
                text: answer
            }, {
                quoted: message
            });
        } else {
            throw new Error('Invalid response from Cerebras API');
        }

    } catch (error) {
        console.error('Alexa Error:', error.message);
        try {
            await sock.sendMessage(chatId, {
                text: "❌ Failed to get response. Please try again later.",
            }, {
                quoted: message
            });
        } catch (e) { }
    }

}

module.exports = alexaCommand;