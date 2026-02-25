const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');

function setupServer(bot) {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(express.json());

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/logs', (req, res) => {
        const logPath = path.join(process.cwd(), 'temp', 'bot.log');
        let logs = 'No logs available yet.';
        if (fs.existsSync(logPath)) {
            logs = fs.readFileSync(logPath, 'utf8');
        }
        res.type('text/plain').send(logs);
    });

    const botStartTime = Date.now();

    io.on('connection', (socket) => {
        console.log('Web client connected');
        
        // Use global bot instance if available to get real-time status
        const currentBot = global.XeonBotInc || bot;

        // Send initial status
        socket.emit('status', {
            connected: currentBot.user?.id ? true : false,
            number: currentBot.user?.id?.split(':')[0] || null
        });

        // Start uptime interval for this client
        const uptimeInterval = setInterval(() => {
            const seconds = Math.floor((Date.now() - botStartTime) / 1000);
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = Math.floor(seconds % 60).toString().padStart(2, '0');
            socket.emit('uptime', `${h}:${m}:${s}`);
        }, 1000);

        socket.on('disconnect', () => {
            clearInterval(uptimeInterval);
        });

        socket.on('requestPairing', async (number) => {
            try {
                const cleanNumber = number.replace(/[^0-9]/g, '');
                const code = await bot.requestPairingCode(cleanNumber);
                const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                socket.emit('pairingCode', formattedCode);
            } catch (error) {
                socket.emit('error', 'Failed to get pairing code: ' + error.message);
            }
        });

        socket.on('restartBot', () => {
            socket.emit('error', 'Restarting bot...');
            setTimeout(() => process.exit(0), 1000);
        });

        socket.on('clearSession', () => {
            const sessionPath = path.join(process.cwd(), 'session');
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                socket.emit('error', 'Session cleared. Restarting...');
                setTimeout(() => process.exit(0), 1000);
            } else {
                socket.emit('error', 'No session found.');
            }
        });

        socket.on('updateSettings', (data) => {
            try {
                const settingsPath = path.join(process.cwd(), 'settings.js');
                let settingsContent = fs.readFileSync(settingsPath, 'utf8');
                
                if (data.botName) {
                    settingsContent = settingsContent.replace(/botName:\s*['"].*?['"]/, `botName: '${data.botName}'`);
                    global.botname = data.botName;
                }
                if (data.ownerNumber) {
                    settingsContent = settingsContent.replace(/ownerNumber:\s*['"].*?['"]/, `ownerNumber: '${data.ownerNumber}'`);
                }
                if (data.prefix) {
                    settingsContent = settingsContent.replace(/prefix:\s*['"].*?['"]/, `prefix: '${data.prefix}'`);
                    global.prefix = data.prefix;
                }

                fs.writeFileSync(settingsPath, settingsContent);
                socket.emit('error', 'Settings updated successfully!');
            } catch (error) {
                socket.emit('error', 'Failed to update settings: ' + error.message);
            }
        });
    });

    // Listen for bot connection updates
    const currentBot = global.XeonBotInc || bot;
    currentBot.ev.on('connection.update', async (s) => {
        const { connection, qr, lastDisconnect } = s;
        if (qr) {
            const qrData = await qrcode.toDataURL(qr);
            io.emit('qr', qrData);
        }
        if (connection === 'open') {
            io.emit('status', { connected: true, number: currentBot.user.id.split(':')[0] });
        }
        if (connection === 'close') {
            io.emit('status', { connected: false });
        }
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Web Panel running on http://0.0.0.0:${PORT}`);
    });

    return io;
}

module.exports = setupServer;
