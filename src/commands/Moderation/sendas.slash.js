const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("sendas")
    .setDescription("Send a message as the bot")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send the message as")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription(
          "The message to send (provide either this or message-id)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription(
          "The ID of the message to clone and send (provide either this or message)"
        )
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    const messageId = interaction.options.getString("message-id");

    if (!user || (!message && !messageId)) {
      await interaction.reply({
        content: "Please provide a user and either a message or a message ID.",
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.channel;
    const member = await interaction.guild.members.fetch(user.id); // Fetch member details

    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (err) {
      await interaction.reply({
        content: "An error occurred while processing your request",
        ephemeral: true,
      });
      return;
    }

    // Create a webhook
    const webhook = await channel.createWebhook({
      name: member.displayName,
      avatar: member.user.displayAvatarURL({ dynamic: true }),
    });

    // Send the message based on provided options
    try {
      if (messageId) {
        // Fetch the original message by ID
        const originalMessage = await channel.messages.fetch(messageId);
        await webhook.send({
          content: originalMessage.content,
          embeds: originalMessage.embeds,
          files: originalMessage.attachments.map((attachment) => ({
            attachment: attachment.url,
            name: attachment.name,
          })),
        });
      } else {
        // Send the provided message
        await webhook.send({
          content: message,
        });
      }
    } catch (error) {
      console.error("Error sending the message:", error);
      await interaction.followUp({
        content: "Failed to send the message.",
        ephemeral: true,
      });
      return;
    }

    // Delete the webhook after sending the message
    await webhook.delete();

    // Delete the original deferred reply
    await interaction.deleteReply();
  },
};
