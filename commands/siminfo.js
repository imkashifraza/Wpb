const axios = require('axios');

async function siminfoCommand(sock, chatId, message) {
    try {
        const text = (message.message?.conversation || message.message?.extendedTextMessage?.text || "").split(' ').slice(1).join(' ').trim();
        if (!text) return await sock.sendMessage(chatId, { text: "Usage: .siminfo <number>" }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        const res = await axios.get(`https://api.cnic.pro/?num=${text}`);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            const info = res.data[0];
            const msg = `👤 *SIM Information*\n\nMobile: ${info.Mobile}\nName: ${info.Name}\nCNIC: ${info.CNIC}\nAddress: ${info.ADDRESS}`;
            await sock.sendMessage(chatId, { text: msg }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: "No information found for this number." }, { quoted: message });
        }
    } catch (error) {
        console.error('Siminfo Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Error: " + error.message }, { quoted: message });
    }
}

module.exports = siminfoCommand;
