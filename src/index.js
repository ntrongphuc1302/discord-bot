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
  // if (interaction.user.id == admin_id) return;
  if (!interaction) return;
  if (!interaction.isCommand()) return;
  else {
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
  }
});

// Join to create voice channel
const joinschema = require("./Schemas/jointocreate.schema.js");
const joinchannelschema = require("./Schemas/jointocreatechannel.schema.js");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (newState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const joindata = await joinschema.findOne({ Guild: newState.guild.id });
  const joinchanneldata = await joinchannelschema.findOne({
    Guild: newState.member.guild.id,
    User: newState.member.id,
  });

  const voicechannel = newState.channel;

  if (!joindata) return;

  if (!voicechannel) return;

  if (voicechannel.id === joindata.Channel) {
    if (joinchanneldata) {
      try {
        return await newState.member.send({
          content: `You already have a join to create channel`,
          ephemeral: true,
        });
      } catch (err) {
        return;
      }
    } else {
      try {
        const originalChannel = await newState.guild.channels.fetch(
          joindata.Channel
        );

        const clonedChannel = await newState.guild.channels.create({
          name: `🗿 ${newState.member.user.displayName}'s Room`,
          type: ChannelType.GuildVoice,
          parent: originalChannel.parentId,
          userLimit: originalChannel.userLimit,
          permissionOverwrites: originalChannel.permissionOverwrites.cache.map(
            (overwrite) => ({
              id: overwrite.id,
              allow: overwrite.allow.bitfield,
              deny: overwrite.deny.bitfield,
            })
          ),
        });

        // Move the cloned channel below the original channel
        await clonedChannel.setPosition(originalChannel.rawPosition + 1);

        await newState.member.voice.setChannel(clonedChannel.id);

        await joinchannelschema.create({
          Guild: newState.guild.id,
          Channel: clonedChannel.id,
          User: newState.member.id,
        });

        // const botMember = await newState.guild.members.fetch(client.user.id);
        // const botColor = botMember.roles.highest.color;

        // const embed = new EmbedBuilder()
        //   .setColor(botColor)
        //   .setTimestamp()
        //   .setAuthor({
        //     name: `${newState.member.user.displayName}`,
        //     iconURL: `${newState.member.user.displayAvatarURL({
        //       dynamic: true,
        //     })}`,
        //   })
        //   .setFooter({
        //     text: `Voice Channel Created`,
        //     iconURL: `${newState.member.user.displayAvatarURL({
        //       dynamic: true,
        //     })}`,
        //   })
        //   .setTitle(`Voice Channel Created`)
        //   .addFields({
        //     name: `Channel Name`,
        //     value: `🗿 ${newState.member.user.displayName}'s Room`,
        //   });

        // await newState.member.send({ embeds: [embed] });
      } catch (err) {
        try {
          await newState.member.send({
            content: `Failed to create voice channel`,
            ephemeral: true,
          });
        } catch (err) {
          return;
        }
      }
    }
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (oldState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const leavechanneldata = await joinchannelschema.findOne({
    Guild: oldState.member.guild.id,
    User: oldState.member.id,
  });
  if (!leavechanneldata) return;

  const voicechannel = await oldState.member.guild.channels.cache.get(
    leavechanneldata.Channel
  );

  try {
    await voicechannel.delete();
  } catch (err) {
    return;
  }

  await joinchannelschema.deleteMany({
    Guild: oldState.guild.id,
    User: oldState.member.id,
  });

  // const botMember = await oldState.guild.members.fetch(client.user.id);
  // const botColor = botMember.roles.highest.color;

  // const embed = new EmbedBuilder()
  //   .setColor(botColor)
  //   .setTimestamp()
  //   .setAuthor({
  //     name: `${oldState.member.user.displayName}`,
  //     iconURL: `${oldState.member.user.displayAvatarURL({ dynamic: true })}`,
  //   })
  //   .setFooter({
  //     text: `Voice Channel Deleted`,
  //     iconURL: `${oldState.member.user.displayAvatarURL({ dynamic: true })}`,
  //   })
  //   .setTitle(`Voice Channel Deleted`)
  //   .addFields({
  //     name: `Channel Name`,
  //     value: `🗿 ${oldState.member.user.displayName}'s Room`,
  //   });

  // await oldState.member.send({ embeds: [embed] });
});
