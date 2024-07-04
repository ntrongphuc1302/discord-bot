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
    const channel = interaction.channel;

    let emojiText = text
      .toLowerCase()
      .split("")
      .map((letter) => {
        const regex = /^[A-Za-z]+$/; // Only convert letters to emojis
        if (letter === " ") return "     "; // Five spaces for a single space

        if (regex.test(letter)) {
          return `:regional_indicator_${letter}:`;
        } else return letter;
      })
      .join("");

    if (emojiText.length > 2000) {
      await interaction.reply({
        content: "Text is too long to convert to emojis!",
        ephemeral: true,
      });
      return;
    }

    try {
      // Create a webhook in the current channel
      const webhookClient = await channel.createWebhook({
        name: interaction.member.displayName, // Use display name of the member
        avatar: interaction.user.displayAvatarURL({ dynamic: true }), // Use user's avatar
      });

      // Send the emoji text via webhook
      await webhookClient.send({
        content: emojiText,
        username: interaction.member.displayName,
        avatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

      await interaction.reply({
        content: "Your message has been emojified!",
        ephemeral: true,
      });

      // Cleanup: Delete the webhook after use
      await webhookClient.delete();
    } catch (error) {
      console.error("Error sending emojified message:", error);
      await interaction.reply({
        content: "Failed to send emojified message.",
        ephemeral: true,
      });
    }
  },
};
