const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vanitycheck")
    .setDescription("Check if a vanity URL is available.")
    .addStringOption((option) =>
      option
        .setName("vanity")
        .setDescription("The vanity to check")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const vanity = options.getString("vanity");

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const sendMessage = async (message, send, avatarUrl = null) => {
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setDescription(message)
        .setFooter({
          text: `Check by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      if (avatarUrl) {
        embed.setThumbnail(avatarUrl);
      }

      if (send) {
        await interaction.editReply({
          embeds: [embed],
        });
      } else {
        await interaction.editReply({ content: message, embeds: [embed] });
      }
    };

    await interaction.deferReply();

    try {
      const invite = await client.fetchInvite(vanity, { withCounts: true });

      if (
        !invite.guild ||
        !invite.guild.vanityURLCode ||
        invite.guild.vanityURLCode !== vanity
      ) {
        await sendMessage(`The vanity invite \`${vanity}\` is **available**!`);
      } else {
        await sendMessage(
          `The vanity invite \`${vanity}\` is **taken** by: [${
            invite.guild.name
          }](https://discord.gg/${vanity}) \n\n**${
            invite.guild.name
          }'s Server Features: ** \n > Member Count: \`${
            invite.memberCount
          }\` \n > Server ID: \`${
            invite.guild.id
          }\` \n> Server Description: \`${
            invite.guild.description ?? "None"
          }\` \n\n This server holds the invite \`${vanity}\` meaning it is **not** available.`,
          true,
          invite.guild.iconURL() // Pass the server avatar URL
        );
      }
    } catch (err) {
      await sendMessage(`The vanity invite \`${vanity}\` is **available**!`);
    }
  },
};
