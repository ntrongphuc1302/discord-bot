const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");
const { summonMessages, dmMessages } = require("../../data/summon.js");
const { embedBotColor } = require("../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("summon")
    .setDescription("Summon a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to summon")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    if (!user) {
      await interaction.reply({
        content: "Please mention a user to summon!",
        ephemeral: true,
      });
      return;
    }

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

    // Fetch the member object for the user who initiated the interaction
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    // Create summon embed
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.member.displayName} cast a summoning spell`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`${summonMessage} ${user}`)
      .setColor(botColor)
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
