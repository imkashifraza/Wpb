const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text;

        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "What song do you want to download?"
            });
        }

        // 🔍 Search YouTube
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "No songs found!"
            });
        }

        const video = videos[0];
        const urlYt = video.url;

        const { key } = await sock.sendMessage(chatId, { text: "➤➤▰▱▱▱▱▱▱▱▱ 25%" }, { quoted: message });
        await new Promise(r => setTimeout(r, 500));
        await sock.sendMessage(chatId, { text: "➤➤➤➤▰▱▱▱▱▱ 50%", edit: key });
        await new Promise(r => setTimeout(r, 500));
        await sock.sendMessage(chatId, { text: "➤➤➤➤➤➤▰▱▱ 75%", edit: key });
        await new Promise(r => setTimeout(r, 500));
        await sock.sendMessage(chatId, { text: "➤➤➤➤➤➤➤➤▰ 90%", edit: key });

        // 🎵 New API (Kraza)
        const apiUrl = `https://api.kraza.qzz.io/download/ytmp3?url=${encodeURIComponent(urlYt)}`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.status) {
            await sock.sendMessage(chatId, { text: "➤➤➤➤➤➤➤➤➤➤ 100%", edit: key });
            await new Promise(r => setTimeout(r, 500));
            // Unsend progress message
            await sock.sendMessage(chatId, { delete: key });

            const audioUrl = response.data.result;
            
            await sock.sendMessage(chatId, {
                image: { url: video.thumbnail },
                caption: `🎧 *Title:* ${video.title}\n🔗 *Link:* ${video.url}`
            }, { quoted: message });

            await sock.sendMessage(chatId, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${video.title}.mp3`
            }, { quoted: message });
        } else {
            throw new Error('Failed to fetch from API');
        }

    } catch (error) {
        console.error('Error in play command:', error);
        await sock.sendMessage(chatId, { 
            text: "Download failed. Please try again later."
        });
    }
}

module.exports = playCommand;

/* Powered by Raza-Bot
   Credits to Raza */