const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedBotColor, owner_id } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botdev")
    .setDescription("Bot Developer Commands"),
  async execute(interaction) {
    if (interaction.user.id != owner_id)
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    const embed = new EmbedBuilder()
      .setTitle("Active Developer")
      .setDescription(
        "[Click here to visit the Active Developer page](https://discord.com/developers/active-developer)"
      )
      .setColor(embedBotColor);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
