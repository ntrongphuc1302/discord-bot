const { SlashCommandBuilder } = require("discord.js");
const superagent = require("superagent");
const onlyEmoji = require("emoji-aware").onlyEmoji;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojimixer")
    .setDescription("Mixes two default emojis together")
    .addStringOption((option) =>
      option
        .setName("emojis")
        .setDescription("The emojis to combine")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const { options } = interaction;
    const eString = options.getString("emojis");
    const input = onlyEmoji(eString);

    if (!input.length) {
      return await interaction.editReply({
        content: "Please provide valid emojis.",
      });
    }

    const response = `One or both of the emojis you provided are invalid.`;

    try {
      const output = await superagent
        .get(`https://tenor.googleapis.com/v2/featured`)
        .query({
          key: process.env.tenor_api_key,
          contentfilter: "high",
          media_filter: "png_transparent",
          component: "proactive",
          collection: "emoji_kitchen_v6",
          q: input.join("_"),
        });

      if (!output.body.results[0]) {
        return await interaction.editReply({ content: response });
      }

      const requester = interaction.member.user;

      // Create a webhook with the author's display name and avatar
      const webhook = await interaction.channel.createWebhook({
        name: requester.displayName,
        avatar: requester.displayAvatarURL({ dynamic: true }),
      });

      // Send the mixed emoji image via the webhook
      await webhook.send({
        content: output.body.results[0].url,
      });

      // Delete the webhook after sending the message
      await webhook.delete();

      // Delete the original deferred reply
      await interaction.deleteReply();
    } catch (error) {
      console.error("Error fetching emojis:", error);
      await interaction.editReply({
        content: "Failed to fetch emojis. Please try again later.",
      });
    }
  },
};
