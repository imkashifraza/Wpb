const axios = require('axios');

async function zuckCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const args = text.split(' ');
        const query = args.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: 'Btao kya search krna h?' 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { 
            text: '🔍 Searching... Please wait.' 
        }, { quoted: message });

        // ✅ STEP 1: Search API (replace with working one if needed)
        const searchUrl = `https://api.princetechn.com/api/search/xvideos?query=${encodeURIComponent(query)}&apikey=prince`;

        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data || !searchRes.data.success || !searchRes.data.result.length) {
            return await sock.sendMessage(chatId, { 
                text: '❌ No results found.' 
            }, { quoted: message });
        }

        const video = searchRes.data.result[0];
        const videoUrl = video.url;

        // ✅ STEP 2: Download API
        const downloadApiUrl = `https://api.kraza.qzz.io/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const res = await axios.get(downloadApiUrl);

        if (res.data && res.data.status) {
            const videoData = res.data.result;

            await sock.sendMessage(chatId, {
                video: { url: videoData.mp4 },
                mimetype: 'video/mp4',
                fileName: `${videoData.title || 'video'}.mp4`,
                caption: `🎬 *${videoData.title || 'Video'}*\n\n> Downloaded Successfully ✅`
            }, { quoted: message });

        } else {
            await sock.sendMessage(chatId, { 
                text: `❌ Download failed.\nLink: ${videoUrl}` 
            }, { quoted: message });
        }

    } catch (error) {
        console.error('[ZUCK ERROR]:', error.message);

        await sock.sendMessage(chatId, { 
            text: '❌ Error: ' + error.message 
        }, { quoted: message });
    }
}

module.exports = zuckCommand;
