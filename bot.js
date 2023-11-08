require("dotenv").config();

const { Client, Intents } = require("discord.js");
const request = require(`request`);
const fs = require(`fs`);
const path = require("path");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("messageCreate", (message) => {
  if (message.channel.type == "DM" && message.author.id != client.user.id) {
    if (message.attachments.first()) {
      message.attachments.forEach((attachment) => {
        download(
          attachment.url,
          path.resolve(process.env.BASE_PATH, attachment.name)
        );
      });
      message.reply("Habs danke");
      console.log("Downloaded " + message.attachments.size + " files");
    } else {
      message.reply("Du musst schon eine Datei senden lmao, imagine cringe");
    }
  }
});

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function download(url, path) {
  request.get(url).on("error", console.error).pipe(fs.createWriteStream(path));
}
