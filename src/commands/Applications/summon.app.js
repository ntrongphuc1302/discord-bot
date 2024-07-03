const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");
const { summonMessages, dmMessages } = require("../../data/summon.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Summon")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    const user = interaction.targetUser;

    const summonMessage =
      summonMessages[Math.floor(Math.random() * summonMessages.length)];

    // Fetch summon GIF from Tenor API
    const apikey = process.env.tenor_api_key;
    const clientkey = "Discord Bot";
    const lmt = 50;
    const query = "summon";

    const link =
      "https://tenor.googleapis.com/v2/search?q=" +
      query +
      "&key=" +
      apikey +
      "&client_key=" +
      clientkey +
      "&limit=" +
      lmt;

    let summonGif = "";
    try {
      const response = await superagent.get(link);
      const results = response.body.results;
      const choice = Math.floor(Math.random() * results.length);
      summonGif = results[choice].media_formats.gif.url;
    } catch (error) {
      console.error("Error fetching GIF from Tenor API:", error);
      summonGif = ""; // Fallback in case of an error
    }

    const formattedDmMessages = dmMessages.map((message) =>
      message
        .replace("{summoner}", `<@${interaction.member.id}>`)
        .replace("{guild}", interaction.guild.name)
        .replace("{user}", user.toString())
    );

    const dmMessage =
      formattedDmMessages[
        Math.floor(Math.random() * formattedDmMessages.length)
      ];

    // Send DM to summoned user
    try {
      await user.send(dmMessage);
    } catch (error) {
      console.error(`Could not send DM to ${user.tag}.`);
    }

    // Create summon embed
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.member.displayName} cast a summoning spell`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`${summonMessage} ${user}`)
      .setColor("#ff0000")
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setImage(summonGif)
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
