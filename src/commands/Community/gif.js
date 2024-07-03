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
    const lmt = 100;

    let choice = Math.floor(Math.random() * lmt);

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

    try {
      await interaction.editReply({ content: output.body.results[choice].url });
    } catch (err) {
      return await interaction.editReply({
        content: `No gifs found with the query \`${query}\``,
      });
    }
  },
};
