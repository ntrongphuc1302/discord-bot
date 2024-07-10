const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hexdecoder")
    .setDescription("Decode a hex string to text")
    .addStringOption((option) =>
      option
        .setName("hex")
        .setDescription("The hex string to decode")
        .setRequired(true)
    ),
  async execute(interaction) {
    const hex = interaction.options.getString("hex").replace(/\s+/g, "");
    const decoded = Buffer.from(hex, "hex").toString("utf8");

    const channel = interaction.channel;
    const user = interaction.member;

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
      name: user.displayName,
      avatar: user.user.displayAvatarURL({ dynamic: true }),
    });

    // Send the message via the webhook
    await webhook.send({
      content: decoded,
    });

    // Delete the webhook after sending the message
    await webhook.delete();

    // Delete the original deferred reply
    await interaction.deleteReply();
  },
};
