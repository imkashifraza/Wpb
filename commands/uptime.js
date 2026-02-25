const moment = require('moment-timezone');

async function uptimeCommand(sock, chatId, message) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeString = `🤖 *Bot Uptime*\n\n` +
        `*Runtime:* ${hours}h ${minutes}m ${seconds}s\n` +
        `*Status:* Active ✅`;

    await sock.sendMessage(chatId, { 
        text: uptimeString,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363423927925534@newsletter',
                newsletterName: 'Raza-Bot',
                serverMessageId: -1
            }
        }
    }, { quoted: message });
}

module.exports = uptimeCommand;