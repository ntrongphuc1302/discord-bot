const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wip-urllookup")
    .setDescription("Get information about a URL.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL you want to look up.")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const { options } = interaction;
    const url = options.getString("url");

    const input = {
      method: "GET",
      url: "https://url-lookup-by-api-ninjas.p.rapidapi.com/v1/urllookup",
      params: {
        url: url,
      },
      headers: {
        "x-rapidapi-key": process.env.rapid_api_key,
        "x-rapidapi-host": "url-lookup-by-api-ninjas.p.rapidapi.com",
      },
    };

    try {
      const output = await axios.request(input);

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle(`Information about ${url}`)
        .setDescription(
          `> Valid: \`${output.data.is_valid}\` \n > Country: \`${output.data.country}\` \n > Region: \`${output.data.region}\` \n > City: \`${output.data.city}\` \n > ZipCode: \`${output.data.zip}\` \n > Timezone: \`${output.data.timezone}\` \n > ISP: \`${output.data.isp}\` \n > URL: \`${out.data.url}\` \n`
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      return await interaction.editReply({
        content: "An error occurred while fetching the data.",
      });
    }
  },
};
