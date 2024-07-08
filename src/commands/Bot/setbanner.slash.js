const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch").default;

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("setbanner")
    .setDescription("Set the bot's banner.")
    .addStringOption((option) =>
      option.setName("url").setDescription("The URL of the new banner")
    )
    .addAttachmentOption((option) =>
      option.setName("file").setDescription("The file for the new banner")
    ),
  async execute(interaction, client) {
    // Get the URL and file options
    const url = interaction.options.getString("url");
    const file = interaction.options.getAttachment("file");

    let bannerUrl;

    // Determine which option to use for the new banner
    if (url) {
      bannerUrl = url;
    } else if (file) {
      bannerUrl = file.url;
    } else {
      return interaction.reply({
        content: "You must provide either a URL or a file for the new banner.",
        ephemeral: true,
      });
    }

    // Defer the reply to prevent the interaction from timing out
    await interaction.deferReply();

    // Fetch the banner to ensure it's a valid image
    try {
      const response = await fetch(bannerUrl);
      const buffer = await response.buffer();

      // Change the bot's banner
      await client.user.setBanner(buffer);

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      // Create an embed to show the new banner
      const embed = new EmbedBuilder()
        .setTitle("Bot Banner Changed Successfully")
        .setDescription(
          `Bot banner changed successfully to: [Banner URL](${bannerUrl})`
        )
        .setImage(bannerUrl)
        .setColor(botColor) // Green color for success
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
      console.error("Error setting bot banner:", error);
      // Edit the deferred reply with an error message
      await interaction.editReply({
        content: "There was an error changing the bot's banner.",
      });
    }
  },
};
