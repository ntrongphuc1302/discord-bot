const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { admin_id, embedBotColor } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botdev")
    .setDescription("Bot Developer Commands"),
  async execute(interaction) {
    if (interaction.user.id !== admin_id) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    // Fetch the bot's member data in the guild
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    // Get the highest role color of the bot
    const botColor = botMember.roles.highest.color || embedBotColor;

    const embed = new EmbedBuilder()
      .setTitle("Active Developer")
      .setDescription(
        "[Click here to visit the Active Developer page](https://discord.com/developers/active-developer)"
      )
      .setColor(botColor);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
