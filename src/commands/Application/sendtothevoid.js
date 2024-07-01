const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Send to the backroom")
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
      .setTimestamp();

    // Check if message content is not empty
    if (message.content) {
      embed.setDescription(message.content);
    } else {
      embed.setDescription("(No content)");
    }

    await channel.send({ embeds: [embed] });
    await message.delete();
    await interaction.reply({
      content: "Message sent to the backroom and deleted.",
      ephemeral: true,
    });
  },
};
