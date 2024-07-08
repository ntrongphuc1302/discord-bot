const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lock")
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
      SendMessages: false,
    });

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`Successfully locked ${channel}`);

    await interaction.reply({ embeds: [embed] });
  },
};
