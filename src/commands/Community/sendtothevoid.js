const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendtovoid")
    .setDescription("Send a message to the void")
    .addStringOption((option) =>
      option
        .setName("messageid")
        .setDescription("The ID of the message to send to the void")
        .setRequired(true)
    ),

  async execute(interaction) {
    const messageId = interaction.options.getString("messageid");
    const channel = interaction.channel;

    // Fetch the message
    const message = await channel.messages.fetch(messageId);
    if (!message) {
      return interaction.reply({
        content: "The specified message does not exist in this channel.",
        ephemeral: true,
      });
    }

    const targetChannel = interaction.guild.channels.cache.get(
      "1088139188576211025"
    );

    if (!targetChannel) {
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

    await targetChannel.send({ embeds: [embed] });
    await message.delete();
    await interaction.reply({
      content: "Message sent to the void and deleted.",
      ephemeral: true,
    });
  },
};
