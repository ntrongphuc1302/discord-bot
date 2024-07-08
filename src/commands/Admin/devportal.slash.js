const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("devportal")
    .setDescription("Get link to the Developer Portal"),
  async execute(interaction) {
    // Fetch the bot's member data in the guild
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    // Get the highest role color of the bot
    const botColor = botMember.roles.highest.color;

    const embed = new EmbedBuilder()
      .setTitle("Developer Portal")
      .setDescription(
        "[Developer Portal](https://discord.com/developers/active-developer)"
      )
      .setColor(botColor);
    // new ButtonBuilder()
    //   .setCustomId("devportal")
    //   .setLabel("")
    //   .setStyle(ButtonStyle.Danger),
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
