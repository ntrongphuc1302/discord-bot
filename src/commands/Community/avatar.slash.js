const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the avatar of")
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || client.user;
    const avatarUrl = user.displayAvatarURL({ format: "png", size: 4096 });

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const embed = new EmbedBuilder()
      .setTitle(`${user.displayName}'s Avatar`)
      .setImage(avatarUrl)
      .setColor(botColor)
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
