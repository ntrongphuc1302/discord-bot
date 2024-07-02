const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get information about the server."),

  async execute(interaction) {
    const guild = interaction.guild;

    // Count members and bots
    let memberCount = 0;
    let botCount = 0;

    guild.members.cache.forEach((member) => {
      if (member.user.bot) {
        botCount++;
      } else {
        memberCount++;
      }
    });

    // Get all server roles excluding @everyone
    const roles = guild.roles.cache
      .filter((role) => role.id !== guild.id) // Filter out @everyone role
      .sort((a, b) => b.position - a.position)
      .map((role) => role.name)
      .join(", ");

    // Calculate emoji counts
    const emojis = guild.emojis.cache;
    const normalEmojis = emojis.filter((emoji) => !emoji.animated).size;
    const animatedEmojis = emojis.filter((emoji) => emoji.animated).size;
    const totalEmojis = emojis.size;

    // Calculate sticker count
    const stickers = guild.stickers.cache.size;

    // Calculate total emojis and stickers count
    const emonsticCount = totalEmojis + stickers;

    // Calculate categories and channels counts
    const categoriesCount = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_CATEGORY"
    ).size;
    const textChannelsCount = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_TEXT"
    ).size;
    const voiceChannelsCount = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_VOICE"
    ).size;
    const announcementChannelsCount = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_NEWS"
    ).size;
    const stageChannelsCount = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_STAGE_VOICE"
    ).size;
    const totalchannelCount =
      categoriesCount +
      textChannelsCount +
      voiceChannelsCount +
      announcementChannelsCount +
      stageChannelsCount;

    // Format creation date
    const now = new Date();
    const diffYears = now.getFullYear() - guild.createdAt.getFullYear();

    let creationDate = guild.createdAt.toLocaleString("vi-VN", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    if (diffYears > 0) {
      creationDate += ` (${diffYears} year${diffYears > 1 ? "s" : ""} ago)`;
    } else {
      creationDate += ` (less than a year ago)`;
    }

    const embed = new EmbedBuilder()
      .setTitle("SERVER INFORMATION")
      .setColor("#591bfe") // Set embed color to #591bfe
      .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })) // Server avatar as thumbnail
      .addFields(
        { name: "Server name", value: `\`\`\`${guild.name}\`\`\`` },
        { name: "Server ID", value: `\`\`\`${guild.id}\`\`\`` },
        { name: "Server owner ID", value: `\`\`\`${guild.ownerId}\`\`\`` },
        {
          name: `Server boosts [ ${guild.premiumSubscriptionCount} ]`,
          value: `\`\`\`Level: ${guild.premiumTier}\`\`\``,
        },
        {
          name: `Server members [ ${memberCount + botCount} ]`,
          value: `\`\`\`Members: ${memberCount} | Bots: ${botCount}\`\`\``,
        },
        {
          name: `Server categories and channels [ ${totalchannelCount} ]`,
          value: `\`\`\`Categories: ${categoriesCount} | Text: ${textChannelsCount} | Voice: ${voiceChannelsCount} | Announcement: ${announcementChannelsCount} | Stage: ${stageChannelsCount}\`\`\``,
        },
        {
          name: `Server emojis and stickers [ ${emonsticCount} ]`,
          value: `\`\`\`Emojis: ${totalEmojis} (Normal: ${normalEmojis}, Animated: ${animatedEmojis}) | Stickers: ${stickers}\`\`\``,
        },
        {
          name: `Server roles [ ${guild.roles.cache.size - 1} ]`, // Subtract 1 for @everyone role
          value: `\`\`\`${roles || "No roles"}\`\`\``,
        },
        {
          name: "Server created on",
          value: `\`\`\`${creationDate}\`\`\``,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
