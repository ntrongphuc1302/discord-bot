const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("Converts text to emojis")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to convert")
        .setRequired(true)
        .setMaxLength(2000)
        .setMinLength(1)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");

    let emojiText = text
      .toLowerCase()
      .split("")
      .map((letter) => {
        if (letter === " ") return "     "; // Five spaces for a single space
        else return `:regional_indicator_${letter}:`;
      })
      .join("");

    if (emojiText.length > 2000)
      emojiText = "Text is too long to convert to emojis!";

    await interaction.reply({ content: emojiText });
  },
};
