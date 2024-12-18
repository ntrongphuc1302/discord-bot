const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Send to NSFW")
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

    try {
      let member = message.member;
      if (!member) {
        member = await interaction.guild.members.fetch(message.author.id);
      }

      const webhookClient = await channel.createWebhook({
        name: member.displayName,
        avatar: message.author.displayAvatarURL({ dynamic: true }),
      });

      await webhookClient.send({
        content: message.content,
        username: member.displayName,
        avatarURL: message.author.displayAvatarURL({ dynamic: true }),
        files: message.attachments.map((attachment) => attachment.url),
      });

      await message.delete();
      await interaction.reply({
        content: "Message sent to NSFW and deleted.",
        ephemeral: true,
      });

      await webhookClient.delete();
    } catch (error) {
      console.error("Error sending message to NSFW:", error);
      await interaction.reply({
        content: "Failed to send message to NSFW.",
        ephemeral: true,
      });
    }
  },
};
