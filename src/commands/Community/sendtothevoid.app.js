const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
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

    try {
      const webhookClient = await channel.createWebhook({
        name: "Backroom Webhook", // Ensure 'name' is explicitly set
        avatar: interaction.user.displayAvatarURL({ dynamic: true }),
      });

      // Send message content or file attachments via webhook
      await webhookClient.send({
        content: message.content,
        username: interaction.member.displayName,
        avatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
        files: message.attachments.map((attachment) => attachment.url),
      });

      await message.delete();
      await interaction.reply({
        content: "Message sent to the backroom and deleted.",
        ephemeral: true,
      });

      await webhookClient.delete(); // Cleanup: Delete the webhook after use
    } catch (error) {
      console.error("Error sending message to backroom:", error);
      await interaction.reply({
        content: "Failed to send message to the backroom.",
        ephemeral: true,
      });
    }
  },
};
