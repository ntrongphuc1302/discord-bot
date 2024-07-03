const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bugreport")
    .setDescription("Report a bug to the developers."),
  async execute(interaction) {
    if (!interaction.guild)
      return await interaction.reply(
        "This command can only be used in a server."
      );

    const modal = new ModalBuilder()
      .setTitle("Bug Report")
      .setCustomId("bugreport");

    const command = new TextInputBuilder()
      .setCustomId("type")
      .setRequired(true)
      .setPlaceholder("Please only state the poblematic feature.")
      .setLabel("What feature did you encounter the bug on?")
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setRequired(true)
      .setPlaceholder("Please describe the bug in detail.")
      .setLabel("Describe the bug or abuse in detail.")
      .setStyle(TextInputStyle.Paragraph);

    const one = new ActionRowBuilder().addComponents(command);
    const two = new ActionRowBuilder().addComponents(description);

    modal.addComponents(one, two);
    await interaction.showModal(modal);
  },
};
