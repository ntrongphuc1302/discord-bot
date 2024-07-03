const { SlashCommandBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Search for a gif")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query to search for")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;
    const query = options.getString("query");
    const apikey = process.env.tenor_api_key;
    const clientkey = "Discord Bot";
    const lmt = 50;

    const link =
      "https://tenor.googleapis.com/v2/search?q=" +
      query +
      "&key=" +
      apikey +
      "&client_key=" +
      clientkey +
      "&limit=" +
      lmt;

    const output = await superagent.get(link).catch((err) => {});
    let gifUrl;

    try {
      gifUrl = output.body.results[Math.floor(Math.random() * lmt)].url;
    } catch (err) {
      await interaction.editReply({
        content: `No gifs found with the query \`${query}\``,
      });
      return;
    }

    const channel = interaction.channel;
    const user = interaction.member;

    // Create a webhook
    const webhook = await channel.createWebhook({
      name: user.displayName,
      avatar: user.user.displayAvatarURL({ dynamic: true }),
    });

    // Send the message via the webhook
    await webhook.send({
      content: gifUrl,
    });

    // Delete the webhook after sending the message
    await webhook.delete();

    // Delete the original deferred reply
    await interaction.deleteReply();
  },
};
