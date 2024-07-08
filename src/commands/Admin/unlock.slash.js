const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to unlock")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({
        content: "You do not have the permissions to use this command.",
        ephemeral: true,
      });

    let channel = interaction.options.getChannel("channel");

    channel.permissionOverwrites.create(interaction.guild.id, {
      SendMessages: true,
    });

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`Successfully unlocked ${channel}`);

    await interaction.reply({ embeds: [embed] });
  },
};
