const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the avatar of")
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || client.user;
    const avatarUrl = user.displayAvatarURL({ format: "png", size: 1024 });

    // Fetch member from guild to get role information
    const guild = interaction.guild;
    const member = await guild.members.fetch(user.id);

    // Get highest role color
    const highestRole = member.roles.highest;
    const highestRoleColor = highestRole.color || "#FFFFFF"; // Default to white if no color is set

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatarUrl)
      .setColor(highestRoleColor)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({
      embeds: [embed],
      //   ephemeral: true,
    });
  },
};
