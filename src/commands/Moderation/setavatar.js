const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch").default; // Import node-fetch and use .default

const ownerId = process.env.discord_bot_owner_id; // Load the bot owner ID from environment variables

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
    if (interaction.user.id !== ownerId) {
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

    // Fetch the avatar to ensure it's a valid image
    try {
      const response = await fetch(avatarUrl);
      const buffer = await response.buffer();

      // Change the bot's avatar
      await client.user.setAvatar(buffer);

      // Reply with a simple text response confirming the avatar change
      await interaction.reply({
        content: `Bot avatar changed successfully to: ${avatarUrl}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error setting bot avatar:", error);
      await interaction.reply({
        content: "There was an error changing the bot's avatar.",
        ephemeral: true,
      });
    }
    async function changeAvatar(bot, avatarData, retries = 3, delay = 5000) {
      try {
        await bot.user.setAvatar(avatarData);
        console.log("Bot avatar changed successfully!");
      } catch (error) {
        if (retries > 0) {
          console.error(
            `Error setting bot avatar: ${error.message}. Retrying...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          await changeAvatar(bot, avatarData, retries - 1, delay * 2);
        } else {
          console.error(
            `Failed to set bot avatar after multiple attempts: ${error.message}`
          );
        }
      }
    }
  },
};
