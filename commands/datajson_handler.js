const fs = require('fs');
const path = require('path');

async function datajsonCommand(sock, chatId, message, fileName) {
    try {
        const filePath = path.join(__dirname, '../datajson', `${fileName}.json`);
        if (!fs.existsSync(filePath)) {
            return await sock.sendMessage(chatId, { text: `❌ File ${fileName}.json not found.` });
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(data) || data.length === 0) {
            return await sock.sendMessage(chatId, { text: `❌ No links found in ${fileName}.json.` });
        }

        const randomLink = data[Math.floor(Math.random() * data.length)].trim();
        
        // Determine if it's an image or video based on extension or common patterns
        const isVideo = /\.(mp4|mov|avi|m4v)$/i.test(randomLink) || randomLink.includes('video');
        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(randomLink) || randomLink.includes('image') || randomLink.includes('i.imgur.com') || randomLink.includes('i.postimg.cc');
        
        const messageOptions = {
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423927925534@newsletter',
                    newsletterName: 'Raza-Bot',
                    serverMessageId: -1
                }
            }
        };

        if (isVideo) {
            await sock.sendMessage(chatId, { video: { url: randomLink }, caption: `✅ Random Video from ${fileName}` }, { quoted: message, ...messageOptions });
        } else {
            await sock.sendMessage(chatId, { image: { url: randomLink }, caption: `✅ Random Image from ${fileName}` }, { quoted: message, ...messageOptions });
        }

    } catch (error) {
        console.error(`Error in datajson command (${fileName}):`, error);
        await sock.sendMessage(chatId, { text: `❌ Error sending content from ${fileName}.` });
    }
}

module.exports = datajsonCommand;
