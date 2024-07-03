const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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

      // Get the user who requested the command
      const requester = interaction.member.user;

      // Create embed with mixed emoji image and footer with requester's display name
      const embed = new EmbedBuilder()
        .setColor("#591bfe")
        .setImage(output.body.results[0].url)
        .setFooter({
          text: `Requested by ${requester.displayName}`,
          icon_url: requester.displayAvatarURL({ dynamic: true }),
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching emojis:", error);
      await interaction.editReply({
        content: "Failed to fetch emojis. Please try again later.",
      });
    }
  },
};
