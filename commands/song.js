const axios = require('axios');
const yts = require('yt-search');

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, { text: 'Usage: .song <song name or YouTube link>' }, { quoted: message });
            return;
        }

        let video;
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            video = { url: query };
        } else {
            const search = await yts(query);
            if (!search || !search.videos.length) {
                await sock.sendMessage(chatId, { text: 'No results found.' }, { quoted: message });
                return;
            }
            video = search.videos[0];
        }

        const { key } = await sock.sendMessage(chatId, { text: "➤➤▰▱▱▱▱▱▱▱▱ 25%" }, { quoted: message });
        
        const apiUrl = `https://api.kraza.qzz.io/download/ytmp3?url=${encodeURIComponent(video.url)}`;
        const res = await axios.get(apiUrl);

        if (res.data && res.data.status) {
            await sock.sendMessage(chatId, { text: "➤➤➤➤➤➤➤➤➤➤ 100%", edit: key });
            await new Promise(r => setTimeout(r, 500));
            await sock.sendMessage(chatId, { delete: key });

            await sock.sendMessage(chatId, {
                image: { url: video.thumbnail || '' },
                caption: `🎵 *Title:* ${video.title || 'Song'}\n🔗 *Link:* ${video.url}`
            }, { quoted: message });

            await sock.sendMessage(chatId, {
                audio: { url: res.data.result },
                mimetype: 'audio/mpeg',
                fileName: `${video.title || 'song'}.mp3`
            }, { quoted: message });
        } else {
            throw new Error('API Error');
        }
    } catch (err) {
        console.error('Song command error:', err);
        await sock.sendMessage(chatId, { text: '❌ Failed to download song.' }, { quoted: message });
    }
}

module.exports = songCommand;
