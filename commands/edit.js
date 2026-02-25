const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { UploadFileUgu, TelegraPh } = require('../lib/uploader');

const FormData = require('form-data');

async function getImageBuffer(message) {
    const m = message.message || {};

    if (m.imageMessage) {
        const stream = await downloadContentFromMessage(m.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
    }

    const quoted = m.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
    }

    return null;
}

async function editCommand(sock, chatId, message) {
    try {
        const text = (message.message?.conversation || message.message?.extendedTextMessage?.text || message.message?.imageMessage?.caption || "").split(' ').slice(1).join(' ').trim();
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted?.imageMessage && !message.message?.imageMessage) {
            return await sock.sendMessage(chatId, { text: "Reply to an image with prompt to edit it." }, { quoted: message });
        }
        
        if (!text) {
            return await sock.sendMessage(chatId, { text: "Please provide a prompt to edit the image." }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const imgMsg = message.message?.imageMessage || quoted.imageMessage;
        const stream = await downloadContentFromMessage(imgMsg, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tmpInput = path.join(tempDir, `edit-${Date.now()}.jpg`);
        fs.writeFileSync(tmpInput, buffer);

        const resultUrl = await magicEraser(tmpInput, text);

        if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);

        await sock.sendMessage(chatId, { image: { url: resultUrl }, caption: `Edited by Raza` }, { quoted: message });

    } catch (error) {
        console.error('Edit Command Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Error: " + error.message }, { quoted: message });
    }
}

async function upload(filename) {
    const form = new FormData();
    form.append("file_name", filename);

    const res = await axios.post(
        "https://api.imgupscaler.ai/api/common/upload/upload-image",
        form,
        {
            headers: {
                ...form.getHeaders(),
                origin: "https://imgupscaler.ai",
                referer: "https://imgupscaler.ai/",
            },
        }
    );

    return res.data.result;
}

async function uploadtoOSS(putUrl, filePath) {
    const file = fs.readFileSync(filePath);
    const type = path.extname(filePath) === ".png" ? "image/png" : "image/jpeg";

    const res = await axios.put(putUrl, file, {
        headers: {
            "Content-Type": type,
            "Content-Length": file.length,
        },
        maxBodyLength: Infinity,
    });

    return res.status === 200;
}

async function createJob(imageUrl, prompt) {
    const form = new FormData();
    form.append("model_name", "magiceraser_v4");
    form.append("original_image_url", imageUrl);
    form.append("prompt", prompt);
    form.append("ratio", "match_input_image");
    form.append("output_format", "jpg");

    const res = await axios.post(
        "https://api.magiceraser.org/api/magiceraser/v2/image-editor/create-job",
        form,
        {
            headers: {
                ...form.getHeaders(),
                "product-code": "magiceraser",
                "product-serial": genserial(),
                origin: "https://imgupscaler.ai",
                referer: "https://imgupscaler.ai/",
            },
        }
    );

    return res.data.result.job_id;
}

async function cekjob(jobId) {
    const res = await axios.get(
        `https://api.magiceraser.org/api/magiceraser/v1/ai-remove/get-job/${jobId}`,
        {
            headers: {
                origin: "https://imgupscaler.ai",
                referer: "https://imgupscaler.ai/",
            },
        }
    );

    return res.data;
}

async function magicEraser(imagePath, prompt) {
    const filename = path.basename(imagePath);
    const up = await upload(filename);

    await uploadtoOSS(up.url, imagePath);

    const cdn = "https://cdn.imgupscaler.ai/" + up.object_name;
    const jobId = await createJob(cdn, prompt);

    let result;
    do {
        await new Promise((r) => setTimeout(r, 3000));
        result = await cekjob(jobId);
    } while (result.code === 300006);

    return result.result.output_url[0];
}

function genserial() {
    let s = "";
    for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
    return s;
}

module.exports = editCommand;