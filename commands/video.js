const axios = require('axios');

const yts = require('yt-search');

const AXIOS_DEFAULTS = {

    timeout: 60000,

    headers: {

        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

        'Accept': 'application/json, text/plain, */*'

    }

};

async function tryRequest(getter, attempts = 3) {

    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt++) {

        try {

            return await getter();

        } catch (err) {

            lastError = err;

            if (attempt < attempts) {

                await new Promise(r => setTimeout(r, 1000 * attempt));

            }

        }

    }

    throw lastError;

}

async function getKeithVideoByUrl(youtubeUrl) {

    const apiUrl = `https://apiskeith.vercel.app/download/video?url=${encodeURIComponent(youtubeUrl)}`;

    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));

    if (res?.data?.status && res?.data?.result) {

        return {

            download: res.data.result,

            title: 'Video'

        };

    }

    throw new Error('Keith API returned no download');

}

async function getYupraVideoByUrl(youtubeUrl) {

    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;

    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));

    if (res?.data?.success && res?.data?.data?.download_url) {

        return {

            download: res.data.data.download_url,

            title: res.data.data.title,

            thumbnail: res.data.data.thumbnail

        };

    }

    throw new Error('Yupra returned no download');

}

async function getOkatsuVideoByUrl(youtubeUrl) {

    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;

    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));

    if (res?.data?.result?.mp4) {

        return { download: res.data.result.mp4, title: res.data.result.title };

    }

    throw new Error('Okatsu ytmp4 returned no mp4');

}

async function getAnabotVideoByUrl(youtubeUrl) {

    const apikey = 'freeApikey';

    const quality = '480';

    const apiUrl = `https://anabot.my.id/api/download/ytmp4?url=\( {encodeURIComponent(youtubeUrl)}&quality= \){encodeURIComponent(quality)}&apikey=${encodeURIComponent(apikey)}`;

    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));

    if (res?.data?.success && res?.data?.data?.result?.urls) {

        return {

            download: res.data.data.result.urls,

            title: res.data.data.result.metadata.title,

            thumbnail: res.data.data.result.metadata.thumbnail

        };

    }

    throw new Error('Anabot returned no download');

}

async function videoCommand(sock, chatId, message) {

    try {

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        

        if (!searchQuery) {

            await sock.sendMessage(chatId, { text: 'What video do you want to download?' }, { quoted: message });

            return;

        }

        // Determine if input is URL or search term

        let videoUrl = '';

        let videoTitle = '';

        let videoThumbnail = '';

        if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {

            videoUrl = searchQuery;

        } else {

            const { videos } = await yts(searchQuery);

            if (!videos || videos.length === 0) {

                await sock.sendMessage(chatId, { text: 'No videos found!' }, { quoted: message });

                return;

            }

            videoUrl = videos[0].url;

            videoTitle = videos[0].title;

            videoThumbnail = videos[0].thumbnail;

        }

        // Just a simple starting message (no animation)

        const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];

        const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : '');

        await sock.sendMessage(chatId, {

            image: { url: thumb },

            caption: `🎬 Downloading *${videoTitle || searchQuery}* ...`

        }, { quoted: message });

        // 🎵 New API (Kraza)
        const apiUrl = `https://api.kraza.qzz.io/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const res = await axios.get(apiUrl);

        if (res.data && res.data.status) {
            const videoData = res.data.result;
            
            // Send the video
            await sock.sendMessage(chatId, {
                video: { url: videoData.mp4 },
                mimetype: 'video/mp4',
                fileName: `${videoData.title || videoTitle || 'video'}.mp4`,
                caption: `*${videoData.title || videoTitle || 'Video'}*\n\n> *_Downloaded by Raza Bot MD_*`
            }, { quoted: message });
        } else {
            throw new Error('API Error');
        }

    } catch (error) {

        console.error('[VIDEO] Command Error:', error?.message || error);

        await sock.sendMessage(chatId, { 

            text: 'Download failed: ' + (error?.message || 'Unknown error') 

        }, { quoted: message });

    }

}

module.exports = videoCommand;