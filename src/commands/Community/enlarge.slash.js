const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedBotColor } = require("../../config");
const axios = require("axios").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enlarge")
    .setDescription("Enlarge an emoji")
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("The emoji to enlarge")
        .setRequired(true)
    ),

  async execute(interaction) {
    let emoji = interaction.options.getString("emoji")?.trim();

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      const id = emoji.match(/\d{15,}/g)[0];

      const type = await axios
        .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then((response) => {
          if (response.status === 200) return "gif";
          else return "png";
        })
        .catch((err) => {
          return "png";
        });

      emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
    }

    if (!emoji.startsWith("http")) {
      return await interaction.reply({
        content: "You cannot enlarge default emojis!",
        ephemeral: true,
      });
    }

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`:white_check_mark: Here is the enlarged emoji`)
      .setImage(emoji)
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
