const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Send to the void")
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const message = interaction.targetMessage;
    const channel = interaction.guild.channels.cache.get("1088139188576211025");

    if (!channel) {
      return interaction.reply({
        content: "The target channel does not exist.",
        ephemeral: true,
      });
    }

    // Fetch the member object to get the display name
    const member = await interaction.guild.members.fetch(message.author.id);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(message.content)
      .setTimestamp();
    // .setFooter({
    //   text: `Sent to the void by ${interaction.user.username}`,
    //   iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
    // });

    await channel.send({ embeds: [embed] });
    await message.delete();
    await interaction.reply({
      content: "Message sent to the void and deleted.",
      ephemeral: true,
    });
  },
};
