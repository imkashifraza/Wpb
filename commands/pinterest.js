const axios = require('axios');

async function pinterestCommand(sock, chatId, message) {
    try {
        const text = (message.message?.conversation || message.message?.extendedTextMessage?.text || "").split(' ').slice(1).join(' ').trim();
        if (!text) return await sock.sendMessage(chatId, { text: "Usage: .pinterest <query>" }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        const res = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(text)}`);
        
        if (res.data && res.data.success && res.data.results && res.data.results.length > 0) {
            const results = res.data.results;
            const images = results.slice(0, 5); // Send top 5 images
            
            for (const imgUrl of images) {
                await sock.sendMessage(chatId, { image: { url: imgUrl } }, { quoted: message });
            }
        } else {
            await sock.sendMessage(chatId, { text: "No images found." }, { quoted: message });
        }
    } catch (error) {
        console.error('Pinterest Command Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Error: " + error.message }, { quoted: message });
    }
}

module.exports = pinterestCommand;
