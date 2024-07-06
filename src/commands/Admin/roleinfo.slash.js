const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedBotColor } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Get information about a specific role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select a role to get information about.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;

    // Get the role option
    const role = options.getRole("role");

    if (!role) {
      await interaction.reply({
        content: "Please provide a valid role.",
        ephemeral: true,
      });
      return;
    }

    // Fetch all members in the guild to ensure accurate count
    await guild.members.fetch();

    // Calculate the reversed role position
    const reversedPosition = guild.roles.cache.size - role.position;

    // Get the member count for the role
    const memberCount = guild.members.cache.filter((member) =>
      member.roles.cache.has(role.id)
    ).size;

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    // Format the role creation date
    const createdAt = role.createdAt;
    const formattedDate = createdAt
      .toLocaleString("vi-VN", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", "");

    // Build the role information embed
    const roleEmbed = new EmbedBuilder()
      .setTitle(`ROLE INFORMATION`)
      .setColor(botColor || embedBotColor)
      .addFields(
        {
          name: "Role",
          value: `${role}`,
        },
        {
          name: "Role Name",
          value: `\`\`\`${role.name}\`\`\``,
        },
        { name: "Role ID", value: `\`\`\`${role.id}\`\`\`` },
        { name: "Role Position", value: `\`\`\`${reversedPosition}\`\`\`` },
        {
          name: "Role Color",
          value: `\`\`\`${role.hexColor.toUpperCase()}\`\`\``,
        },

        {
          name: "Role Display",
          value: `\`\`\`${role.hoist ? "Yes" : "No"}\`\`\``,
        },
        {
          name: "Role Mentionable",
          value: `\`\`\`${role.mentionable ? "Yes" : "No"}\`\`\``,
        },
        {
          name: "Role Members",
          value: `\`\`\`${memberCount}\`\`\``,
        },
        {
          name: "Role Created On",
          value: `\`\`\`${formattedDate}\`\`\``,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // Send the role information embed as a reply
    await interaction.reply({
      embeds: [roleEmbed],
      ephemeral: false,
    });
  },
};
