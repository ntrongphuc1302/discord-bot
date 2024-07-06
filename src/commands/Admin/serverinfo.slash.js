const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedBotColor, member_role_id, bot_role_id } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get information about the server."),

  async execute(interaction) {
    // Permission check (replace with your bot owner's ID)
    if (interaction.user.id !== admin_id) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const { guild } = interaction;
    const { members } = guild;
    const { name, ownerId, memberCount } = guild;

    // Verification level
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

    // Count members with specific roles
    const memberRoleCount = members.cache.filter((member) =>
      member.roles.cache.has(member_role_id)
    ).size;
    const botRoleCount = members.cache.filter((member) =>
      member.roles.cache.has(bot_role_id)
    ).size;

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    const embed = new EmbedBuilder()
      .setTitle("SERVER INFORMATION")
      .setColor(botColor) // Set embed color to #591bfe
      .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })) // Server avatar as thumbnail
      .addFields(
        { name: "Server Name", value: `\`\`\`${name}\`\`\`` },
        { name: "Server ID", value: `\`\`\`${guild.id}\`\`\`` },
        {
          name: "Server Owner",
          value: `\`\`\`${owner.user.displayName} | ${owner.user.tag}\`\`\``,
        }, // Mention server owner
        { name: "Server Region", value: `\`\`\`Vietnam\`\`\`` },
        {
          name: "Server Verification level",
          value: `\`\`\`${baseVerificationLevel}\`\`\``,
        },
        {
          name: `Server Boosts [ ${guild.premiumSubscriptionCount} ]`,
          value: `\`\`\`Level: ${guild.premiumTier}\`\`\``,
        },
        {
          name: `Server Members [ ${memberCount} ]`,
          value: `\`\`\`Members: ${memberRoleCount} | Bots: ${botRoleCount}\`\`\``,
        },
        {
          name: `Server Categories And Channels [  ]`,
          value: `\`\`\`Categories:  | Text:  | Voice:  | Announcement:  | Stage: \`\`\``,
        },
        {
          name: `Server Emojis And Stickers [ ${emonsticCount} ]`,
          value: `\`\`\`Emojis: ${totalEmojis} (Normal: ${normalEmojis}, Animated: ${animatedEmojis}) | Stickers: ${stickers}\`\`\``,
        },
        {
          name: `Server Roles [ ${guild.roles.cache.size - 1} ]`, // Subtract 1 for @everyone role
          value: `\`\`\`${roles || "No roles"}\`\`\``,
        },
        {
          name: "Server Created On",
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
