const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Manage channel locks")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lock")
        .setDescription("Locks a channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to lock")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unlock")
        .setDescription("Unlocks a channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to unlock")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: "You do not have the permissions to use this command.",
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    let channel = interaction.options.getChannel("channel");

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    let embedDescription;

    switch (subcommand) {
      case "lock":
        await channel.permissionOverwrites.edit(
          interaction.guild.roles.everyone,
          {
            SEND_MESSAGES: false,
          }
        );
        embedDescription = `Successfully locked ${channel}`;
        break;
      case "unlock":
        await channel.permissionOverwrites.edit(
          interaction.guild.roles.everyone,
          {
            SEND_MESSAGES: true,
          }
        );
        embedDescription = `Successfully unlocked ${channel}`;
        break;
      default:
        return interaction.reply({
          content: "Invalid subcommand.",
          ephemeral: true,
        });
    }

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(embedDescription);

    await interaction.reply({ embeds: [embed] });
  },
};
