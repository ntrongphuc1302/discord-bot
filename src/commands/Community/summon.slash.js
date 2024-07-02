const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  summonMessages,
  dmMessages,
  summonGifs,
} = require("../../data/summon.js");

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

    const summonGif = summonGifs[Math.floor(Math.random() * summonGifs.length)];

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
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
