const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
  Events,
  ChannelType,
} = require(`discord.js`);
const fs = require("fs");
const path = require("path");
const {
  admin_id,
  command_log_channel_id,
  console_log_channel_id,
  embedDark,
  embedErrorColor,
} = require("./config");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

require("dotenv").config();

// Auto-generate .env-example
function generateEnvExample() {
  try {
    // Set the project root directory
    const projectRoot = path.resolve(__dirname, ".."); // One folder up from src

    // Recursive function to scan files
    function scanForFiles(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          // Exclude node_modules and other irrelevant folders
          if (file !== "node_modules" && file !== ".git") {
            results = results.concat(scanForFiles(filePath));
          }
        } else if (file.endsWith(".js")) {
          results.push(filePath);
        }
      });
      return results;
    }

    // Scan for environment variables
    const jsFiles = scanForFiles(projectRoot);
    const envVariables = new Set();

    jsFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf-8");
      const regex = /process\.env\.(\w+)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        envVariables.add(match[1]);
      }
    });

    // Write to .env-example at the project root
    const exampleFilePath = path.join(projectRoot, ".env-example");
    const envContent = Array.from(envVariables)
      .sort()
      .map((key) => `${key}=`)
      .join("\n");

    fs.writeFileSync(exampleFilePath, envContent);
  } catch (err) {
    console.error("Error generating .env-example file:", err);
  }
}

// Generate .env-example before starting the bot
generateEnvExample();

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

// Terminal Logging to Discord channel
const originalLog = console.log;
const originalError = console.error;

console.log = async (message, ...optionalParams) => {
  originalLog(message, ...optionalParams);

  const logChannel = await client.channels.fetch(console_log_channel_id);

  if (logChannel) {
    const botMember = await logChannel.guild.members.fetch(client.user.id);
    const botColor = botMember.roles.highest.color || embedDark;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setTitle("Log Message")
      .setDescription("```" + message + "```")
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  }
};

console.error = async (message, ...optionalParams) => {
  originalError(message, ...optionalParams);

  const logChannel = await client.channels.fetch(console_log_channel_id);
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor(embedErrorColor)
      .setTitle("Error Message")
      .setDescription("```" + message + "```")
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  }
};

// Interaction Logging
client.on("interactionCreate", async (interaction) => {
  if (!interaction) return;
  if (!interaction.isCommand()) return;

  const channel = await client.channels.cache.get(command_log_channel_id); // Channel ID to log the command
  const server = interaction.guild.name;
  const serverInviteLink = "http://discord.gg/suyMRyKjrv";
  const channelUsedID = interaction.channel.id;
  const userID = interaction.user.id;
  const commandName = interaction.commandName; // Get the command name

  const botMember = await interaction.guild.members.fetch(
    interaction.client.user.id
  );
  const botColor = botMember.roles.highest.color;

  const embed = new EmbedBuilder()
    .setColor(botColor)
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
});
