const path = require('path');
const fs = require('fs');

async function reloadCommand(sock, chatId, message, commandName) {
    if (!commandName) {
        return await sock.sendMessage(chatId, { text: '❌ Please provide a command name to reload. Example: .reload help' }, { quoted: message });
    }

    const commandPath = path.join(__dirname, `${commandName}.js`);

    if (!fs.existsSync(commandPath)) {
        return await sock.sendMessage(chatId, { text: `❌ Command file "${commandName}.js" not found.` }, { quoted: message });
    }

    try {
        // Clear from require cache
        const resolvedPath = require.resolve(commandPath);
        delete require.cache[resolvedPath];
        
        // Test require
        require(commandPath);
        
        await sock.sendMessage(chatId, { text: `✅ Command ".${commandName}" has been reloaded successfully!` }, { quoted: message });
    } catch (error) {
        console.error(`Error reloading command ${commandName}:`, error);
        await sock.sendMessage(chatId, { text: `❌ Failed to reload command ".${commandName}": ${error.message}` }, { quoted: message });
    }
}

module.exports = reloadCommand;
