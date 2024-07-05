const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("Generate a QR code from a given text")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The text to generate a QR code from")
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("input");
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      text
    )}`;

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setTitle("QR Code Generated")
      .setDescription(`[Download the QR code](${qrCodeUrl})`)
      .setImage(qrCodeUrl)
      .setFooter({
        text: `${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
