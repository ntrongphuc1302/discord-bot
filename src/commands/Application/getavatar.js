const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Get Avatar")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    try {
      const user = interaction.targetUser;
      const avatarUrl = user.displayAvatarURL({ format: "png", size: 4096 });

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
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 1024,
          }),
        });

      await interaction.reply({
        embeds: [embed],
        // Uncomment the following line if you want the reply to be ephemeral
        // ephemeral: true,
      });
    } catch (error) {
      console.error("Error executing context menu command:", error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
