const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
} = require(`discord.js`);
const fs = require("fs");
const { admin_id, command_log_channel_id } = require("./config");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

require("dotenv").config();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.discord_bot_token);
})();

// Interactoin Logging
client.on("interactionCreate", async (interaction) => {
  if (interaction.user.id == admin_id) return;
  if (!interaction) return;
  if (!interaction.isCommand()) return;
  else {
    const channel = await client.channels.cache.get(command_log_channel_id); // Channel ID to log the command
    const server = interaction.guild.name;
    const serverInviteLink = "http://discord.gg/suyMRyKjrv";
    const channelUsedID = interaction.channel.id;
    const userID = interaction.user.id;
    const commandName = interaction.commandName; // Get the command name

    const embed = new EmbedBuilder()
      .setColor("#591bfe")
      .setTitle("Command Used")
      .addFields({ name: "Server", value: `[${server}](${serverInviteLink})` })
      .addFields({ name: "Channel", value: `<#${channelUsedID}>` })
      .addFields({ name: "User", value: `<@${userID}>` })
      .addFields({ name: "Command Name", value: `\`\`\`${commandName}\`\`\`` })
      .addFields({ name: "Command Used", value: `\`\`\`${interaction}\`\`\`` })
      .setTimestamp()
      .setFooter({
        text: `Command used by ${interaction.user.displayName}`,
        iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
      });

    await channel.send({ embeds: [embed] });
  }
});
