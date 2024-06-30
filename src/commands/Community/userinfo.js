const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get information about")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const roles =
      member.roles.cache
        .filter((role) => role.id !== interaction.guild.id) // Remove @everyone role
        .map((role) => role.name)
        .join(", ") || "No roles";

    const highestRole = member.roles.highest;
    const highestRoleColor = highestRole.color || "#FFFFFF"; // Default to white if no color is set

    const isBoosting = member.premiumSince ? "Yes" : "No";
    const joinDate = member.joinedAt
      ? member.joinedAt.toLocaleDateString("en-GB")
      : "Unknown";
    const creationDate = user.createdAt
      ? user.createdAt.toLocaleDateString("en-GB")
      : "Unknown";

    const permissions = new PermissionsBitField(member.permissions.bitfield);
    const globalPermissions = permissions.has(
      PermissionsBitField.Flags.Administrator
    )
      ? "👑 Server Owner (all permissions)"
      : "Standard User";

    const embed = new EmbedBuilder()
      .setTitle(`${member.displayName}'s Information`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor(highestRoleColor)
      .addFields(
        { name: "Username", value: user.username, inline: true },
        { name: "User ID", value: user.id, inline: true },
        {
          name: "Roles",
          value: roles.length > 1024 ? `${roles.slice(0, 1021)}...` : roles,
          inline: true,
        },
        {
          name: "Nickname",
          value: member.nickname || "No nickname",
          inline: true,
        },
        { name: "Is boosting", value: isBoosting, inline: true },
        { name: "Global permissions", value: globalPermissions, inline: true },
        { name: "Joined this server on", value: joinDate, inline: true },
        { name: "Account created on", value: creationDate, inline: true }
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
