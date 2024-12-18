const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("View Avatar")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    try {
      const user = interaction.targetUser;
      const avatarUrl = user.displayAvatarURL({ format: "png", size: 4096 });

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      const embed = new EmbedBuilder()
        .setTitle(`${user.displayName}'s Avatar`)
        .setImage(avatarUrl)
        .setColor(botColor)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
          }),
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
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
