const axios = require('axios');

const tempmailData = {};

async function tempmailCommand(sock, chatId, message) {
    try {
        const text = (message.message?.conversation || message.message?.extendedTextMessage?.text || "").split(' ').slice(1).join(' ').trim();
        const prefix = '.'; // Assume . for now, main.js handles it usually

        if (!text || text === 'generate') {
            const res = await axios.get('https://api.princetechn.com/api/tempmail/generate?apikey=prince');
            if (res.data && res.data.success) {
                const email = res.data.result.email;
                tempmailData[chatId] = email;
                await sock.sendMessage(chatId, { text: `📧 *Temp Mail Generated*\n\nEmail: ${email}\n\nUse .tempmail inbox to check messages.` }, { quoted: message });
            }
        } else if (text === 'inbox') {
            const email = tempmailData[chatId];
            if (!email) return await sock.sendMessage(chatId, { text: "No email generated. Use .tempmail generate first." }, { quoted: message });

            const res = await axios.get(`https://api.princetechn.com/api/tempmail/inbox?apikey=prince&email=${encodeURIComponent(email)}`);
            if (res.data && res.data.success) {
                if (Array.isArray(res.data.result) && res.data.result.length > 0) {
                    let msg = `📥 *Inbox for ${email}*\n\n`;
                    res.data.result.forEach((m, i) => {
                        msg += `${i + 1}. From: ${m.senderName} (${m.from})\nSubject: ${m.subject}\nID: ${m.id}\n\n`;
                    });
                    msg += `Use .tempmail view <messageid> to read.`;
                    await sock.sendMessage(chatId, { text: msg }, { quoted: message });
                } else {
                    await sock.sendMessage(chatId, { text: "Inbox is empty." }, { quoted: message });
                }
            }
        } else if (text.startsWith('view')) {
            const msgId = text.split(' ')[1];
            const email = tempmailData[chatId];
            if (!email || !msgId) return await sock.sendMessage(chatId, { text: "Usage: .tempmail view <messageid>" }, { quoted: message });

            const res = await axios.get(`https://api.princetechn.com/api/tempmail/message?apikey=prince&email=${encodeURIComponent(email)}&messageid=${msgId}`);
            if (res.data && res.data.success) {
                const content = res.data.result.data.html || res.data.result.data.text || "No content found.";
                await sock.sendMessage(chatId, { text: `📖 *Message Content*\n\n${content.replace(/<[^>]*>?/gm, '')}` }, { quoted: message });
            }
        }
    } catch (error) {
        console.error('Tempmail Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Error: " + error.message }, { quoted: message });
    }
}

module.exports = tempmailCommand;
