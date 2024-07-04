const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get information about the server."),

  async execute(interaction) {
    const { guild } = interaction;
    const { members } = guild;
    const { name, ownerId, memberCount } = guild;

    // Verifycation level
    let baseVerificationLevel = guild.verificationLevel;

    if (baseVerificationLevel == 0) baseVerificationLevel = "None";
    if (baseVerificationLevel == 1) baseVerificationLevel = "Low";
    if (baseVerificationLevel == 2) baseVerificationLevel = "Medium";
    if (baseVerificationLevel == 3) baseVerificationLevel = "High";
    if (baseVerificationLevel == 4) baseVerificationLevel = "Very High";

    // Get server owner
    const owner = guild.members.cache.get(ownerId);

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
        { name: "Server name", value: `\`\`\`${name}\`\`\`` },
        { name: "Server ID", value: `\`\`\`${guild.id}\`\`\`` },
        {
          name: "Server owner",
          value: `\`\`\`${owner.user.displayName} | ${owner.user.tag}\`\`\``,
        }, // Mention server owner
        { name: "Server region", value: `\`\`\`Vietnam\`\`\`` },
        {
          name: "Server verification level",
          // value: `\`\`\`${baseVerificationLevel}\`\`\``,
          value: `\`\`\`Very High\`\`\``,
        },
        {
          name: `Server boosts [ ${guild.premiumSubscriptionCount} ]`,
          value: `\`\`\`Level: ${guild.premiumTier}\`\`\``,
        },
        {
          name: `Server members [ ${memberCount} ]`,
          value: `\`\`\`Members:  | Bots:\`\`\``,
        },
        {
          name: `Server categories and channels [  ]`,
          value: `\`\`\`Categories:  | Text:  | Voice:  | Announcement:  | Stage: \`\`\``,
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
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
