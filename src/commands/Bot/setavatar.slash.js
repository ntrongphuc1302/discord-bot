const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch").default;
const { embedBotColor, owner_id } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setavatar")
    .setDescription("Set the bot's avatar.")
    .addStringOption((option) =>
      option.setName("url").setDescription("The URL of the new avatar")
    )
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("The file for the new avatar")
    ),
  async execute(interaction, client) {
    // Check if the user is the bot owner
    if (interaction.user.id !== owner_id) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    // Get the URL and file options
    const url = interaction.options.getString("url");
    const file = interaction.options.getAttachment("file");

    let avatarUrl;

    // Determine which option to use for the new avatar
    if (url) {
      avatarUrl = url;
    } else if (file) {
      avatarUrl = file.url;
    } else {
      return interaction.reply({
        content: "You must provide either a URL or a file for the new avatar.",
        ephemeral: true,
      });
    }

    // Defer the reply to prevent the interaction from timing out
    await interaction.deferReply();

    // Fetch the avatar to ensure it's a valid image
    try {
      const response = await fetch(avatarUrl);
      const buffer = await response.buffer();

      // Change the bot's avatar
      await client.user.setAvatar(buffer);

      // Create an embed to show the new avatar
      const embed = new EmbedBuilder()
        .setTitle("Bot Avatar Changed Successfully")
        .setDescription(
          `Bot avatar changed successfully to: [Avatar URL](${avatarUrl})`
        )
        .setImage(avatarUrl)
        .setColor(embedBotColor) // Green color for success
        .setFooter({
          text: `Changed by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Edit the deferred reply with a confirmation message and embed
      await interaction.editReply({
        content: null,
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error setting bot avatar:", error);
      // Edit the deferred reply with an error message
      await interaction.editReply({
        content: "There was an error changing the bot's avatar.",
      });
    }
  },
};
