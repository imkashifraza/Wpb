const helpCommand = async (sock, chatId, message) => {
      const helpText = `╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ⋆✩ʚ◌❬❮❰ Raza-Bot ❱❯❭◌ɞʚ◌꒱
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯
  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮           
  ꒰◌ɞ   ✪ Version: *1.0.0*   ʚ◌꒱
  ꒰◌ɞ   ✪ Owner: *Mr. Raza* ʚ◌꒱
  ꒰◌ɞ   ✪ YT: *Its Raza*        ʚ◌꒱
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🌐 General Commands  ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .help or .menu
  ꒰◌ɞ   ✪ .ping
  ꒰◌ɞ   ✪ .alive
  ꒰◌ɞ   ✪ .tts <text>
  ꒰◌ɞ   ✪ .owner
  ꒰◌ɞ   ✪ .joke
  ꒰◌ɞ   ✪ .quote
  ꒰◌ɞ   ✪ .fact
  ꒰◌ɞ   ✪ .weather <city>
  ꒰◌ɞ   ✪ .news
  ꒰◌ɞ   ✪ .attp <text>
  ꒰◌ɞ   ✪ .8ball <question>
  ꒰◌ɞ   ✪ .groupinfo
  ꒰◌ɞ   ✪ .staff or .admins
  ꒰◌ɞ   ✪ .vv
  ꒰◌ɞ   ✪ .trt <text> <lang>
  ꒰◌ɞ   ✪ .jid
  ꒰◌ɞ   ✪ .url
  ꒰◌ɞ   ✪ .pakdb <number>
  ꒰◌ɞ   ✪ .alexa <question>
  ꒰◌ɞ   ✪ .edit <text>
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     👮‍♂️ Admin Commands    ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .mute
  ꒰◌ɞ   ✪ .unmute
  ꒰◌ɞ   ✪ .kick
  ꒰◌ɞ   ✪ .ban
  ꒰◌ɞ   ✪ .unban
  ꒰◌ɞ   ✪ .promote
  ꒰◌ɞ   ✪ .demote
  ꒰◌ɞ   ✪ .tagall
  ꒰◌ɞ   ✪ .hidetag
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🔒 Owner Commands    ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .mode
  ꒰◌ɞ   ✪ .autostatus
  ꒰◌ɞ   ✪ .setpp
  ꒰◌ɞ   ✪ .clearsession
  ꒰◌ɞ   ✪ .cleartmp
  ꒰◌ɞ   ✪ .zuck <query>
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🎨 Image/Sticker      ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .sticker
  ꒰◌ɞ   ✪ .simage
  ꒰◌ɞ   ✪ .remini
  ꒰◌ɞ   ✪ .removebg
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🖼️ Pies Commands      ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .pies
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🎮 Game Commands      ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .tictactoe
  ꒰◌ɞ   ✪ .hangman
  ꒰◌ɞ   ✪ .trivia
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🤖 AI Commands        ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .ai
  ꒰◌ɞ   ✪ .gpt
  ꒰◌ɞ   ✪ .gemini
  ꒰◌ɞ   ✪ .imagine
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🎯 Fun Commands       ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .joke
  ꒰◌ɞ   ✪ .meme
  ꒰◌ɞ   ✪ .dare
  ꒰◌ɞ   ✪ .truth
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     📥 Downloader         ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .video
  ꒰◌ɞ   ✪ .song
  ꒰◌ɞ   ✪ .tiktok
  ꒰◌ɞ   ✪ .facebook
  ꒰◌ɞ   ✪ .instagram
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🧩 MISC Commands      ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .uptime
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     🖼️ ANIME Commands     ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .anime
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯

  ╭┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╮
  ꒰◌ɞ     📂 Media Commands      ʚ◌꒱
  ༝◌≻┄┄┄┄┄◦≺⊹♡⊹≻◦┄┄┄┄┄≺◌༝
  ꒰◌ɞ   ✪ .anime, .ausand, .chitanda, .dú
  ꒰◌ɞ   ✪ .gaivip, .gura, .icon, .ig
  ꒰◌ɞ   ✪ .kana, .kurumi, .loli, .mirai
  ꒰◌ɞ   ✪ .mông, .mui, .neko, .phongcanh
  ꒰◌ɞ   ✪ .poem, .rem, .sagiri, .siesta
  ꒰◌ɞ   ✪ .thinh, .umaru, .vdanime
  ꒰◌ɞ   ✪ .vdcosplay, .vdgai
  ╰┄◦ʚ꩜ɞ◦┄◦≺⊹♡⊹≻◦┄◦ʚ꩜ɞ◦┄╯`;
      await sock.sendMessage(chatId, { 
          text: helpText,
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
  };

  module.exports = helpCommand;
  